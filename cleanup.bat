@echo off
echo ============================================
echo  Limpando arquivos desnecessarios...
echo ============================================
echo.

REM Remover arquivos desnecessários da raiz
if exist "test.js" (
    echo [X] Removendo test.js
    del /f /q "test.js"
)

if exist "Simulador_ADS.zip" (
    echo [X] Removendo Simulador_ADS.zip
    del /f /q "Simulador_ADS.zip"
)

if exist "API_EXAMPLES.md" (
    echo [X] Removendo API_EXAMPLES.md (substituido por API_DOCUMENTATION.md)
    del /f /q "API_EXAMPLES.md"
)

REM Remover script antigo de processamento
if exist "scripts\process_data.js" (
    echo [X] Removendo scripts\process_data.js (substituido por consolidate_data.js)
    del /f /q "scripts\process_data.js"
)

REM Remover arquivos de exemplo da pasta public (opcional)
if exist "public\api-client-example.js" (
    echo [X] Removendo public\api-client-example.js
    del /f /q "public\api-client-example.js"
)

if exist "public\index.html" (
    echo [X] Removendo public\index.html
    del /f /q "public\index.html"
)

echo.
echo ============================================
echo  Limpeza concluida!
echo ============================================
echo.
echo Os seguintes arquivos/pastas foram mantidos:
echo  [V] database/all_data.json
echo  [V] src/ (servidor e rotas)
echo  [V] scripts/consolidate_data.js
echo  [V] Materias/ (dados originais)
echo  [V] public/images/ (imagens das questoes)
echo  [V] README.md
echo  [V] API_DOCUMENTATION.md
echo  [V] package.json
echo.
pause

