<?php

namespace App\Http\Controllers;

use App\Models\Paciente;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;

class PacienteController extends Controller
{
    //
    private function calcularIdade(?string $dataNascimento): ?int
    {
        if (empty($dataNascimento)) {
            return null;
        }

        try {
            $nascimento = Carbon::parse($dataNascimento);
            return $nascimento->age;
        } catch (Exception) {
            return null;
        }
    }

    public function store(Request $request){
        try{
            $idadeCalculada = $this->calcularIdade($request->input('data_nascimento'));
            $request->merge(['idade' => $idadeCalculada ?? $request->input('idade')]);

            $request->validate([
            'nome' => 'required|string|max:60',
            'genero' => 'required|string|max:30',
            'prontuario' => 'required|integer',
            'cpf' => 'required|string|max:15',
            'data_nascimento' => 'nullable|string|max:16',
            'idade' => 'nullable|integer',
            'profissao' => 'string|max:100',
            'data_avaliacao' => 'nullable|string|max:16',
        ]);
        $paciente = Paciente::create($request->all());
        return response()->json([
            'message' => 'Paciente cadastrado com sucesso.',
            'data' => $paciente
        ], 201);
        
        }catch (Exception $e){
            return response()->json([
                'message' => "Erro ao criar um novo contato.",
                'error' => $e->getMessage()
                ], 500);
        };
    }

    public function index(Request $request){
        try{
            $busca = $request->busca;
                $pacientes = Paciente::when($busca, function($query) use ($busca) {
                $query->where('id_paciente', 'like', "%{$busca}%")
                ->orWhere('nome', 'like', "%{$busca}%")
                ->orWhere('genero', 'like', "%{$busca}%")
                ->orWhere('prontuario', 'like', "%{$busca}%")
                ->orWhere('cpf', 'like', "%{$busca}%")
                ->orWhere('data_nascimento', 'like', "%{$busca}%")
                ->orWhere('idade', 'like', "%{$busca}%")
                ->orWhere('profissao', 'like', "%{$busca}%")
                ->orWhere('data_avaliacao', 'like', "%{$busca}%");
            })
            ->with('amputacoes')
            ->orderBy('id_paciente', 'desc')
            ->paginate(5);

            return response()->json([
                'message' => 'Paciente listados com sucesso.',
                'data' => $pacientes
            ], 201);

        }catch (Exception $e){
            return response()->json([
                'message' => "Erro ao listar pacientes.",
                'error' => $e->getMessage()
                ], 500);
        };
        
    }

    public function show($id){
        try{
            $paciente = Paciente::findOrFail($id);

            return response()->json([
                'message' => 'Paciente pesquisado com sucesso.',
                'data' => $paciente
            ], 201);

        }catch (Exception $e){
            return response()->json([
                'message' => "Erro ao pesquisar paciente.",
                'error' => $e->getMessage()
                ], 500);
        };
        
    }

    public function update(Request $request, $id){
        try{
            $idadeCalculada = $this->calcularIdade($request->input('data_nascimento'));
            $request->merge(['idade' => $idadeCalculada ?? $request->input('idade')]);

            $request->validate([
            'nome' => 'required|string|max:60',
            'genero' => 'required|string|max:30',
            'prontuario' => 'required|integer',
            'cpf' => 'required|string|max:15',
            'data_nascimento' => 'nullable|string|max:16',
            'idade' => 'nullable|integer',
            'profissao' => 'string|max:100',
            'data_avaliacao' => 'nullable|string|max:16',
        ]);
        $paciente = Paciente::findOrFail($id);
        $paciente->update($request->all());
        return response()->json([
            'message' => 'Paciente atualizado com sucesso.',
            'data' =>$paciente
        ], 201);
        }catch (Exception $e){
            return response()->json([
                'message' => "Erro ao atualizar paciente.",
                'error' => $e->getMessage()
                ], 500);
        };
        
        }

    public function destroy($id){
        try{
            $paciente = Paciente::findOrFail($id);
            $paciente->delete();
            return response()->json([
                'message' => 'Paciente excluido com sucesso.',
                'data' => $paciente
            ], 201);
        }catch (Exception $e){
            return response()->json([
                'message' => "Erro ao excluir paciente.",
                'error' => $e->getMessage()
                ], 500);
        };
        
        }

}
