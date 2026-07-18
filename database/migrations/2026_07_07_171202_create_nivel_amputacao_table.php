<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('nivel_amputacao', function (Blueprint $table) {
            $table->id();
            $table->integer('desarticulacao_ombro');
            $table->integer('transumeral');
            $table->integer('desarticulacao_cotovelo');
            $table->integer('transradial');
            $table->integer('desarticulacao_punho');
            $table->integer('parcial_mao');
            $table->integer('dedos_mao');
            $table->integer('desarticulacao_quadril');
            $table->integer('transfemoral');
            $table->integer('desarticulacao_joelho');
            $table->integer('transtibal');
            $table->integer('syme');
            $table->integer('parcial_pe');
            $table->integer('dedos_pe');
            $table->foreignId('paciente_id')->nullable()->constrained('paciente', 'id_paciente')->nullOnDelete();
            $table->integer('direito');
            $table->integer('esquerdo');
            $table->string('tempo_amputacao', 13);
            $table->string('lado_dominante', 13);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nivel_amputacao');
    }
};
