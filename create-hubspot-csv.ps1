# Create HubSpot CSV from email list
$emails = Get-Content "all-emails.txt" -Encoding UTF8
$csvContent = @()

# Add CSV header
$csvContent += "Email,Company Name,Industry,Lead Source,Country,Lifecycle Stage"

# Process each email
foreach ($email in $emails) {
    $cleanEmail = $email.Trim().ToLower()
    
    # Basic email validation
    if ($cleanEmail -match "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$") {
        # Extract company name from domain
        $domain = ($cleanEmail -split "@")[1]
        $companyName = ($domain -split "\.")[0]
        
        # Create CSV row
        $row = "`"$cleanEmail`",`"$companyName`",`"Travel & Tourism`",`"Email Database Import`",`"Iran`",`"Lead`""
        $csvContent += $row
    }
}

# Save to CSV file
$csvContent | Out-File "travel-companies-hubspot.csv" -Encoding UTF8

Write-Host "Created travel-companies-hubspot.csv with $($csvContent.Count - 1) emails" -ForegroundColor Green