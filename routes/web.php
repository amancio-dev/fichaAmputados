<?php

use App\Http\Controllers\AmputacaoController;
use App\Http\Controllers\PacienteController;
use Illuminate\Support\Facades\Route;

// Route::get('/', function () {
//     return view('welcome');
// });

// Route::post('/criar-paciente', [PacienteController::class,'store'])->name('criarPaciente');
// Route::get('/listar-paciente', [PacienteController::class,'index'])->name('listarPaciente');
// Route::get('/listar-paciente/{id}', [PacienteController::class,'show'])->name('buscarPaciente');

Route::get('/', function () {
    return view('paciente');
});

Route::get('/dashboard', function () {
    return view('dashboard');
});

Route::get('/relatorios', function () {
    return view('relatorios');
});

Route::apiResource('paciente', PacienteController::class);


Route::get('/amputacao', function () {
    return view('welcome');
});

Route::apiResource('amputacao', AmputacaoController::class);