<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Amputacao extends Model
{
    //
    protected $table = 'nivel_amputacao';
    protected $fillable = [
        'paciente_id',
        'desarticulacao_ombro',
        'transumeral',
        'desarticulacao_cotovelo',
        'transradial',
        'desarticulacao_punho',
        'parcial_mao',
        'dedos_mao',
        'desarticulacao_quadril',
        'transfemoral',
        'desarticulacao_joelho',
        'transtibal',
        'syme',
        'parcial_pe',
        'dedos_pe',
        'direito',
        'esquerdo',
        'tempo_amputacao',
        'lado_dominante'
    ];

    public function paciente()
    {
        return $this->belongsTo(Paciente::class, 'paciente_id');
    }
}
