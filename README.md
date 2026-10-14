# Clínica BZ

Site completo com 22 páginas, HTML, CSS e JavaScript estáticos.

- Design compartilhado: `dist/dovena-system.css`, com Geist/Inter e os tokens de cores, tamanhos e componentes da referência Dovena.
- Navegação, galeria, comparadores e filtros: `dist/app.js`.
- Rolagem horizontal fixa das especialidades: `dist/motion.js`.
- Imagens originais da Clínica BZ e imagens ilustrativas da referência: `dist/assets/`.
- Informações da clínica: site público clinicabz.com.br.
- Avaliações: perfil oficial no Google, conferido em 14/10/2026 (4,8; 99 avaliações). Os comentários publicados são trechos reais e possuem link para a fonte.

Para abrir localmente, execute dentro desta pasta:

```sh
python3 -m http.server 4173 --directory dist
```

Depois abra `http://localhost:4173`.

Não há etapa de build, dependências de execução ou formulário que simule envio. Os agendamentos abrem o WhatsApp da clínica; a confirmação é feita pela equipe.


A composição usa Geist nos títulos e Inter nos textos e controles. A hero traz título animado, benefícios e agendamento. Os resultados reais têm prévia, expansão e navegação horizontal; os cards de especialidades usam fotos ilustrativas de procedimentos. O texto sobre a clínica ganha contraste durante a rolagem. As três avaliações mantêm a animação automática. A localização apresenta o endereço da unidade na Cidade Dutra.

Para reconstruir as 22 páginas após editar o conteúdo:

```sh
python3 scripts/build_site.py
```
