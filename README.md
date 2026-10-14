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


Ajustes finais: composição compartilhada com largura máxima de 1368 px e seções de 130 px; navegação Inter 14 px, hero Geist 88 px e títulos Geist 48 px. Cards com molduras iguais e imagens completas; rolagem mais lenta e início centralizado. Resultados reais expandem na home. Seção de localização com informações expansíveis e fotos reais; equipe em composição editorial; footer com contatos e colunas. Fotografias ilustrativas de consulta para serviços sem foto específica são geradas com ImageGen; resultados e profissionais vêm do site da clínica.
