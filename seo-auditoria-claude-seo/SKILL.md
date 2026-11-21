---
name: seo-auditoria-claude-seo
description: >-
  Use para auditoria de SEO de um site ou página (técnico, schema, conteúdo
  E-E-A-T, local, sitemap, imagens, GEO para respostas de IA), usando a
  biblioteca claude-seo (MIT) instalada no computador.
---
# Auditoria de SEO com claude-seo

A biblioteca claude-seo 2.6.1 (MIT, AgriciDaniel) fica em `<tools>/claude-seo`. Cada sub-skill é um SKILL.md com o método.

1. Identifique o pedido e abra só o SKILL.md certo em `<tools>/claude-seo/skills/<nome>/SKILL.md`:
   - Site inteiro: `seo-audit`. Uma página: `seo-page`. Técnico: `seo-technical`.
   - Schema: `seo-schema`. Conteúdo: `seo-content`. Negócio local e Maps: `seo-local` e `seo-maps`.
   - Sitemap: `seo-sitemap`. Imagens: `seo-images`. Busca por IA: `seo-geo`.
   - Na dúvida, abra o hub `seo`.
2. Siga o método do SKILL.md. Os scripts Python ficam em `skills/seo/scripts` e no ambiente isolado criado pelo install.sh em `~/.claude/skills/seo`.
3. Não use extensões pagas (DataForSEO, Ahrefs, SE Ranking e outras) sem chave e autorização do dono.
4. Entregue os achados por prioridade, com evidência de cada um (URL e trecho), sem inventar métricas.

Onde mais está instalada: `~/.claude/skills` (Claude Code) e `~/.cursor/skills` (Cursor). Para a VPS ou outra máquina, há um pacote portátil em `<tools>/pacotes-portateis/` (`claude-seo-2.6.1-portatil.tar.gz` e `instalar-claude-seo.sh`).
