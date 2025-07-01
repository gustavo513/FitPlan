import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function obtenerPrefAlimentarias() {
    
    const pref_alims = await prisma.prefAlim.findMany();

    return pref_alims;
}

export async function vincularPrefAlim(idPrefAlim: number, idUsuario: number) {
    
    const perfil = await prisma.perfil.findUnique({
        where: {
            id_usuario: idUsuario
        }
    });

    const perfilPrefAlim = await prisma.perfil_PrefAlim.create({
        data: {
            id_pref_alim: idPrefAlim,
            id_perfil: perfil?.id_perfil!
        }
    });

    return perfilPrefAlim;
}

export async function desvincularPrefAlim(idPrefAlim: number, idPerfil: number) {
    
    return await prisma.perfil_PrefAlim.updateMany({
        where: {
            id_perf_prefalim: idPrefAlim,
            id_perfil: idPerfil,
            estado: 1
        },
        data: {
            fecha_fin: new Date(Date.now()),
            estado: 0
        }
    });
}