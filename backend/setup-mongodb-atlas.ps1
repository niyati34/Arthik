# MongoDB Atlas Setup Script
# This script helps you update your .env file with MongoDB Atlas connection string

Write-Host "=== MongoDB Atlas Setup ===" -ForegroundColor Green
Write-Host ""

Write-Host "To get your MongoDB Atlas connection string:" -ForegroundColor Yellow
Write-Host "1. Go to https://www.mongodb.com/atlas" -ForegroundColor White
Write-Host "2. Create a free account and cluster" -ForegroundColor White
Write-Host "3. Click 'Connect' on your cluster" -ForegroundColor White
Write-Host "4. Choose 'Connect your application'" -ForegroundColor White
Write-Host "5. Copy the connection string" -ForegroundColor White
Write-Host ""

$connectionString = Read-Host "Paste your MongoDB Atlas connection string here"

if ($connectionString -and $connectionString -like "*mongodb+srv://*") {
    # Read current .env file
    $envContent = Get-Content .env
    
    # Replace the MONGODB_URI line
    $newEnvContent = $envContent | ForEach-Object {
        if ($_ -like "MONGODB_URI=*") {
            "MONGODB_URI=$connectionString"
        } else {
            $_
        }
    }
    
    # Write back to .env file
    $newEnvContent | Out-File -FilePath .env -Encoding UTF8
    
    Write-Host "✅ MongoDB Atlas connection string updated successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your .env file now contains:" -ForegroundColor Yellow
    Get-Content .env | Where-Object { $_ -like "MONGODB_URI=*" }
} else {
    Write-Host "❌ Invalid connection string. Please make sure it starts with 'mongodb+srv://'" -ForegroundColor Red
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Make sure to replace 'username' and 'password' in the connection string" -ForegroundColor White
Write-Host "2. Run 'npm start' to start your server" -ForegroundColor White
