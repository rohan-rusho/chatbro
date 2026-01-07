@echo off
echo ============================================
echo   ChatBro - Starting Local Web Server
echo ============================================
echo.
echo Server will start on: http://localhost:8080
echo.
echo Press Ctrl+C to stop the server
echo.
echo Opening browser in 3 seconds...
echo ============================================
echo.

REM Start PowerShell HTTP Server
powershell -Command "& {$Hso = New-Object Net.HttpListener; $Hso.Prefixes.Add('http://localhost:8080/'); $Hso.Start(); Write-Host 'Server running at http://localhost:8080'; Write-Host 'Press Ctrl+C to stop...'; Start-Process 'http://localhost:8080'; while ($Hso.IsListening) {$Hct = $Hso.GetContext(); $Hrq = $Hct.Request; $Hrs = $Hct.Response; $Huri = $Hrq.Url.LocalPath; if ($Huri -eq '/') {$Huri = '/index.html'}; $Hfile = Join-Path $PWD $Huri.TrimStart('/'); if (Test-Path $Hfile) {$Hcontent = [System.IO.File]::ReadAllBytes($Hfile); $Hext = [System.IO.Path]::GetExtension($Hfile); $Hct_types = @{'.html'='text/html';'.css'='text/css';'.js'='application/javascript';'.json'='application/json';'.png'='image/png';'.jpg'='image/jpeg';'.gif'='image/gif';'.svg'='image/svg+xml';'.ico'='image/x-icon'}; $Hrs.ContentType = if($Hct_types[$Hext]){$Hct_types[$Hext]}else{'application/octet-stream'}; $Hrs.ContentLength64 = $Hcontent.Length; $Hrs.OutputStream.Write($Hcontent, 0, $Hcontent.Length)} else {$Hrs.StatusCode = 404; $Herr = [System.Text.Encoding]::UTF8.GetBytes('404 Not Found'); $Hrs.OutputStream.Write($Herr, 0, $Herr.Length)}; $Hrs.Close()}}"
