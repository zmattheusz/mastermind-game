package com.itau.mastermind.util;

import java.time.ZoneId;

/**
 * Fuso usado para datas de sequência (streak) e encerramento de partidas.
 */
public final class FusoHorarioPadrao {

    public static final ZoneId BRASIL = ZoneId.of("America/Sao_Paulo");

    private FusoHorarioPadrao() {
    }
}
