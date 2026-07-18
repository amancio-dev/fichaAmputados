<?php

namespace Tests\Unit;

use App\Models\Paciente;
use PHPUnit\Framework\TestCase;

class PacienteTest extends TestCase
{
    public function test_model_uses_the_expected_table_name(): void
    {
        $model = new Paciente();

        $this->assertSame('paciente', $model->getTable());
    }
}
