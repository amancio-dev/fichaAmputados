<?php

namespace Tests\Feature;

use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PacienteControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_calcula_idade_a_partir_da_data_de_nascimento(): void
    {
        $dataNascimento = now()->subYears(30)->subMonths(2)->format('Y-m-d');

        $response = $this->postJson('/paciente', [
            'nome' => 'Maria Silva',
            'genero' => 'Feminino',
            'prontuario' => 101,
            'cpf' => '12345678900',
            'data_nascimento' => $dataNascimento,
            'idade' => 99,
            'profissao' => 'Enfermeira',
            'acompanhante' => 'João',
            'data_avaliacao' => now()->format('Y-m-d'),
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.idade', Carbon::parse($dataNascimento)->age);
    }
}
