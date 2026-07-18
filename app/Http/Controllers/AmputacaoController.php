<?php

namespace App\Http\Controllers;

use App\Models\Amputacao;
use Exception;
use Illuminate\Http\Request;

class AmputacaoController extends Controller
{
    //
    public function store(Request $request){
        try{
            $request->validate([
            'desarticulacao_ombro' => 'integer',
            'transumeral' => 'integer',
            'desarticulacao_cotovelo' => 'integer',
            'transradial' => 'integer',
            'desarticulacao_punho' => 'integer',
            'parcial_mao' => 'integer',
            'dedos_mao' => 'integer',
            'desarticulacao_quadril' => 'integer',
            'transfemoral' => 'integer',
            'desarticulacao_joelho' => 'integer',
            'transtibal' => 'integer',
            'syme' => 'integer',
            'parcial_pe' => 'integer',
            'dedos_pe' => 'integer',
            'paciente_id' => 'nullable|integer|exists:paciente,id_paciente',
            'direito' => 'integer',
            'esquerdo' => 'integer',
            'tempo_amputacao' => 'string|max:13',
            'lado_dominante' => 'string|max:13',
        ]);
        $amputacao = Amputacao::create($request->all());
        return response()->json([
            'message' => 'Amputação cadastrada com sucesso.',
            'data' => $amputacao
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

            // If cliente requests amputacoes for a specific paciente, return those directly
            if ($request->filled('paciente_id')) {
                $amputacoes = Amputacao::where('paciente_id', $request->paciente_id)
                    ->orderBy('id', 'desc')
                    ->get();

                return response()->json([
                    'message' => 'Amputações consultadas por paciente com sucesso.',
                    'data' => $amputacoes
                ], 200);
            }

            $amputacoes = Amputacao::leftJoin('paciente', 'nivel_amputacao.paciente_id', '=', 'paciente.id_paciente')
                ->select('nivel_amputacao.*')
                ->when($busca, function($query) use ($busca) {
                    $query->where('nivel_amputacao.id', 'like', "%{$busca}%")
                    ->orWhere('desarticulacao_ombro', 'like', "%{$busca}%")
                    ->orWhere('transumeral', 'like', "%{$busca}%")
                    ->orWhere('desarticulacao_cotovelo', 'like', "%{$busca}%")
                    ->orWhere('transradial', 'like', "%{$busca}%")
                    ->orWhere('desarticulacao_punho', 'like', "%{$busca}%")
                    ->orWhere('parcial_mao', 'like', "%{$busca}%")
                    ->orWhere('dedos_mao', 'like', "%{$busca}%")
                    ->orWhere('desarticulacao_quadril', 'like', "%{$busca}%")
                    ->orWhere('transfemoral', 'like', "%{$busca}%")
                    ->orWhere('desarticulacao_joelho', 'like', "%{$busca}%")
                    ->orWhere('transtibal', 'like', "%{$busca}%")
                    ->orWhere('syme', 'like', "%{$busca}%")
                    ->orWhere('parcial_pe', 'like', "%{$busca}%")
                    ->orWhere('dedos_pe', 'like', "%{$busca}%")
                    ->orWhere('direito', 'like', "%{$busca}%")
                    ->orWhere('esquerdo', 'like', "%{$busca}%")
                    ->orWhere('tempo_amputacao', 'like', "%{$busca}%")
                    ->orWhere('lado_dominante', 'like', "%{$busca}%")
                    ->orWhere('paciente.nome', 'like', "%{$busca}%")
                    ->orWhere('paciente.profissao', 'like', "%{$busca}%")
                    ->orWhere('paciente.data_avaliacao', 'like', "%{$busca}%");
                })
                ->orderBy('nivel_amputacao.id', 'desc')
                ->paginate(5);

            return response()->json([
                'message' => 'Amputações listadas com sucesso.',
                'data' => $amputacoes
            ], 201);

        }catch (Exception $e){
            return response()->json([
                'message' => "Erro ao listar amputações.",
                'error' => $e->getMessage()
                ], 500);
        };
        
    }

    public function show($id){
        try{
            $amputacao = Amputacao::findOrFail($id);

            return response()->json([
                'message' => 'Amputação pesquisada com sucesso.',
                'data' => $amputacao
            ], 201);

        }catch (Exception $e){
            return response()->json([
                'message' => "Erro ao pesquisar amputação.",
                'error' => $e->getMessage()
                ], 500);
        };
        
    }

    public function update(Request $request, $id){
        try{
            $request->validate([
            'desarticulacao_ombro' => 'integer',
            'transumeral' => 'integer',
            'desarticulacao_cotovelo' => 'integer',
            'transradial' => 'integer',
            'desarticulacao_punho' => 'integer',
            'parcial_mao' => 'integer',
            'dedos_mao' => 'integer',
            'desarticulacao_quadril' => 'integer',
            'transfemoral' => 'integer',
            'desarticulacao_joelho' => 'integer',
            'transtibal' => 'integer',
            'syme' => 'integer',
            'parcial_pe' => 'integer',
            'dedos_pe' => 'integer',
            'direito' => 'integer',
            'esquerdo' => 'integer',
            'tempo_amputacao' => 'string|max:13',
            'lado_dominante' => 'string|max:13',
        ]);
        $amputacao = Amputacao::findOrFail($id);
        $amputacao->update($request->all());
        return response()->json([
            'message' => 'Amputação atualizada com sucesso.',
            'data' => $amputacao
        ], 201);
        }catch (Exception $e){
            return response()->json([
                'message' => "Erro ao atualizar amputação.",
                'error' => $e->getMessage()
                ], 500);
        };
        
        }

    public function destroy($id){
        try{
            $amputacao = Amputacao::findOrFail($id);
            $amputacao->delete();
            return response()->json([
                'message' => 'Amputação excluida com sucesso.',
                'data' => $amputacao
            ], 201);
        }catch (Exception $e){
            return response()->json([
                'message' => "Erro ao excluir amputação.",
                'error' => $e->getMessage()
                ], 500);
        };
        
        }
}
