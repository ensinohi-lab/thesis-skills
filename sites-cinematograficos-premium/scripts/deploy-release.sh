#!/usr/bin/env bash
# deploy-release.sh — publica um build estático como release nova + troca do symlink `current` (rollback em 1 comando).
# Origem: deploys do Estudo de Referência (tar pelo ssh, porque a máquina de build não tinha rsync; Caddy não é tocado).
# NUNCA rode sem a ordem explícita do cliente/dono. O script exige a frase de aprovação e só faz ensaio por padrão.
#   APROVACAO='"Pode publicar a versão fluida" (Dono, 16/11 09:08)' HOST=usuario@servidor \
#   RAIZ=/caminho/da/landing/no/servidor DIST=dist ./deploy-release.sh            # ensaio: mostra o que faria
#   ... ./deploy-release.sh --valer                                                # executa
# Chave SSH: a sua (ex.: ~/.ssh/config com Host apontando para a chave). Este script não lê nem imprime chaves.
set -euo pipefail
: "${APROVACAO:?cite a frase de aprovação do dono (quem, quando, palavras exatas). Sem ela, não há deploy.}"
: "${HOST:?HOST=usuario@servidor}"; : "${RAIZ:?RAIZ=pasta que contém releases/ e current}"; DIST=${DIST:-dist}
[[ -d "$DIST" ]] || { echo "falta o build em $DIST" >&2; exit 1; }
R=$(date +%Y%m%d%H%M); VALER=0; [[ "${1:-}" == "--valer" ]] && VALER=1
N_LOCAL=$(find "$DIST" -type f | wc -l); SHA_LOCAL=$(cd "$DIST" && find . -type f -print0 | sort -z | xargs -0 sha256sum | sha256sum | cut -d' ' -f1)
ANTERIOR=$(ssh "$HOST" "readlink '$RAIZ/current' || true")
echo "aprovação: $APROVACAO"; echo "release nova: $RAIZ/releases/$R ($N_LOCAL arquivos, sha $SHA_LOCAL)"; echo "anterior (rollback): $ANTERIOR"
[[ $VALER == 1 ]] || { echo "ENSAIO: nada enviado. Rode com --valer para publicar."; exit 0; }
ssh "$HOST" "mkdir -p '$RAIZ/releases/$R'"
tar -C "$DIST" -cf - . | ssh "$HOST" "tar -C '$RAIZ/releases/$R' -xf -"
N_REMOTO=$(ssh "$HOST" "find '$RAIZ/releases/$R' -type f | wc -l")
SHA_REMOTO=$(ssh "$HOST" "cd '$RAIZ/releases/$R' && find . -type f -print0 | sort -z | xargs -0 sha256sum | sha256sum | cut -d' ' -f1")
[[ "$N_LOCAL" == "$N_REMOTO" && "$SHA_LOCAL" == "$SHA_REMOTO" ]] || { echo "CONFERÊNCIA FALHOU ($N_LOCAL/$N_REMOTO arquivos): current NÃO foi trocado" >&2; exit 1; }
ssh "$HOST" "cd '$RAIZ' && ln -sfn 'releases/$R' current && readlink current"
echo "no ar: releases/$R · rollback: ssh $HOST \"cd '$RAIZ' && ln -sfn '$ANTERIOR' current\""
echo "agora: conferir rotas (200/404), Range 206 dos MP4, e o site no ar no desktop e no celular emulado (medir-fluidez.mjs)."
