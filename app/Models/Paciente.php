<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Amputacao;

class Paciente extends Model
{
    //
    protected $table = 'paciente';
    protected $primaryKey = 'id_paciente';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'nome',
        'genero',
        'prontuario',
        'cpf',
        'data_nascimento',
        'idade',
        'profissao',
        'acompanhante',
        'data_avaliacao'
    ];

    public function amputacoes()
    {
        return $this->hasMany(Amputacao::class, 'paciente_id');
    }
}

