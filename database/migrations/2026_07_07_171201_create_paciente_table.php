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
        Schema::create('paciente', function (Blueprint $table) {
            $table->id('id_paciente');
            $table->string('nome', 60);
            $table->string('genero', 30);
            $table->integer('prontuario');
            $table->string('cpf', 15)->unique();
            $table->string('data_nascimento', 16);
            $table->integer('idade');            
            $table->string('profissao', 40)->default('Não informado');            
            $table->string('acompanhante', 40)->default('Não informado');            
            $table->string('data_avaliacao', 16);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paciente');
    }
};
