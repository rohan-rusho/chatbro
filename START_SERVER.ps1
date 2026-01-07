# ChatBro - PowerShell HTTP Server
# Double-click this file or run: powershell -ExecutionPolicy Bypass -File .\START_SERVER.ps1

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   ChatBro - Local Web Server" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting server on http://localhost:8080" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8080/")
$listener.Start()

Write-Host "✓ Server is running!" -ForegroundColor Green
Write-Host "✓ Opening browser..." -ForegroundColor Green
Write-Host ""

# Open browser after 2 seconds
Start-Sleep -Seconds 2
Start-Process "http://localhost:8080"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        # Get requested file path
        $requestedPath = $request.Url.LocalPath
        if ($requestedPath -eq "/") {
            $requestedPath = "/index.html"
        }
        
        $filePath = Join-Path $PSScriptRoot $requestedPath.TrimStart('/')
        
        # Log request
        $timestamp = Get-Date -Format "HH:mm:ss"
        Write-Host "[$timestamp] " -NoNewline -ForegroundColor Gray
        Write-Host "$($request.HttpMethod) $requestedPath" -ForegroundColor White
        
        if (Test-Path $filePath -PathType Leaf) {
            # File exists - serve it
            $content = [System.IO.File]::ReadAllBytes($filePath)
            $extension = [System.IO.Path]::GetExtension($filePath)
            
            # Set content type based on extension
            $contentTypes = @{
                '.html' = 'text/html; charset=utf-8'
                '.css'  = 'text/css; charset=utf-8'
                '.js'   = 'application/javascript; charset=utf-8'
                '.json' = 'application/json; charset=utf-8'
                '.png'  = 'image/png'
                '.jpg'  = 'image/jpeg'
                '.jpeg' = 'image/jpeg'
                '.gif'  = 'image/gif'
                '.svg'  = 'image/svg+xml'
                '.ico'  = 'image/x-icon'
                '.woff' = 'font/woff'
                '.woff2' = 'font/woff2'
                '.ttf'  = 'font/ttf'
            }
            
            $response.ContentType = if ($contentTypes[$extension]) { 
                $contentTypes[$extension] 
            } else { 
                'application/octet-stream' 
            }
            
            $response.ContentLength64 = $content.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($content, 0, $content.Length)
        } else {
            # File not found
            $response.StatusCode = 404
            $errorMessage = "404 - File Not Found: $requestedPath"
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($errorMessage)
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            Write-Host "  → 404 Not Found" -ForegroundColor Red
        }
        
        $response.Close()
    }
}
finally {
    $listener.Stop()
    Write-Host ""
    Write-Host "Server stopped." -ForegroundColor Yellow
}
