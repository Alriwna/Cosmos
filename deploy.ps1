param(
    [string]$ftpPassword = ""
)

$ftpHost = "ftpupload.net"
$ftpUsername = "if0_42340359"
$localPath = Join-Path (Get-Location) "dist"
$remotePath = "/htdocs"

# Prompt for password if not provided
if (-not $ftpPassword) {
    $ftpPassword = Read-Host -Prompt "Enter FTP Password for $ftpUsername"
}

if (-not $ftpPassword) {
    Write-Error "Password cannot be empty."
    exit 1
}

# Function to upload a single file
function Upload-File {
    param (
        [string]$localFilePath,
        [string]$remoteFilePath
    )
    Write-Host "Uploading $localFilePath to ftp://$ftpHost$remoteFilePath..."
    $uri = [System.Uri]"ftp://$ftpHost$remoteFilePath"
    $ftpRequest = [System.Net.FtpWebRequest]::Create($uri)
    $ftpRequest.Credentials = New-Object System.Net.NetworkCredential($ftpUsername, $ftpPassword)
    $ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
    $ftpRequest.UseBinary = $true
    $ftpRequest.KeepAlive = $false
    
    $fileBytes = [System.IO.File]::ReadAllBytes($localFilePath)
    $ftpRequest.ContentLength = $fileBytes.Length
    
    $requestStream = $ftpRequest.GetRequestStream()
    $requestStream.Write($fileBytes, 0, $fileBytes.Length)
    $requestStream.Close()
    $requestStream.Dispose()
    
    try {
        $response = $ftpRequest.GetResponse()
        $response.Close()
        $response.Dispose()
    } catch {
        Write-Error "Failed to upload file $localFilePath - $($_.Exception.Message)"
        throw $_
    }
}

# Function to create a remote directory
function Create-FtpDirectory {
    param (
        [string]$remoteDirPath
    )
    Write-Host "Checking/Creating directory ftp://$ftpHost$remoteDirPath..."
    $uri = [System.Uri]"ftp://$ftpHost$remoteDirPath"
    $ftpRequest = [System.Net.FtpWebRequest]::Create($uri)
    $ftpRequest.Credentials = New-Object System.Net.NetworkCredential($ftpUsername, $ftpPassword)
    $ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
    $ftpRequest.KeepAlive = $false
    
    try {
        $response = $ftpRequest.GetResponse()
        $response.Close()
        $response.Dispose()
    } catch {
        # Check if directory already exists (error code 550 usually)
        Write-Host "Directory might already exist: $($_.Exception.Message)"
    }
}

# Recursive function to walk directories and upload files
function Deploy-Folder {
    param (
        [string]$localFolder,
        [string]$remoteFolder
    )
    
    # Upload files in this directory
    $files = Get-ChildItem -Path $localFolder -File
    foreach ($file in $files) {
        $remoteFilePath = "$remoteFolder/$($file.Name)"
        Upload-File -localFilePath $file.FullName -remoteFilePath $remoteFilePath
    }
    
    # Recurse into subdirectories
    $subdirs = Get-ChildItem -Path $localFolder -Directory
    foreach ($subdir in $subdirs) {
        $remoteSubDir = "$remoteFolder/$($subdir.Name)"
        Create-FtpDirectory -remoteDirPath $remoteSubDir
        Deploy-Folder -localFolder $subdir.FullName -remoteFolder $remoteSubDir
    }
}

# Run deployment
if (Test-Path $localPath) {
    Write-Host "Starting deployment from $localPath to ftp://$ftpHost$remotePath..."
    Deploy-Folder -localFolder $localPath -remoteFolder $remotePath
    Write-Host "Deployment completed successfully!"
} else {
    Write-Error "Local build directory 'dist' not found. Please run npm run build first."
}
