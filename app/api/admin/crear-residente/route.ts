import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(request: Request) {
  try {
    const { nombre, email, password, numero_apartamento } = await request.json();

    if (!nombre || !email || !password || !numero_apartamento) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios.' }, { status: 400 });
    }

    // 1. Verificar que la unidad existe y no tiene residente
    const { data: unidad, error: unidadError } = await supabaseAdmin
      .from('unidades')
      .select('id, usuario_id')
      .eq('numero_apartamento', numero_apartamento)
      .single();

    if (unidadError || !unidad) {
      return NextResponse.json({ error: 'No existe la unidad ' + numero_apartamento }, { status: 404 });
    }

    if (unidad.usuario_id) {
      return NextResponse.json({ error: 'La unidad ' + numero_apartamento + ' ya tiene un residente asignado.' }, { status: 400 });
    }

    // 2. Crear usuario en auth.users
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError || !authUser.user) {
      return NextResponse.json({ error: 'Error al crear usuario: ' + (authError?.message ?? 'desconocido') }, { status: 400 });
    }

    // 3. Insertar perfil en tabla usuarios
    const { error: perfilError } = await supabaseAdmin
      .from('usuarios')
      .insert({
        id: authUser.user.id,
        nombre,
        email,
        rol: 'residente',
      });

    if (perfilError) {
      // Rollback: borrar el usuario de auth
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      return NextResponse.json({ error: 'Error al crear perfil: ' + perfilError.message }, { status: 500 });
    }

    // 4. Asociar la unidad con el nuevo usuario
    const { error: updateError } = await supabaseAdmin
      .from('unidades')
      .update({ usuario_id: authUser.user.id })
      .eq('id', unidad.id);

    if (updateError) {
      return NextResponse.json({ error: 'Error al asociar unidad: ' + updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      mensaje: 'Residente creado y asignado a Apt ' + numero_apartamento,
      user_id: authUser.user.id,
    });
  } catch (e) {
    return NextResponse.json({ error: 'Error interno: ' + (e as Error).message }, { status: 500 });
  }
}