# Send message to Microsoft Teams using PowerShell

## Send channel post

```powershell
# Team and channel IDs
$team = @{
    id = ""
    channel = ""
}

# Connect to Microsoft Graph
Connect-MgGraph -NoWelcome -Scopes "ChannelMessage.Send"

# Set the message content
$messageContent = "Hello, this is a private message sent via PowerShell and Microsoft Graph."

# Create the message
$message = @{
    body = @{
        content = $messageContent
    }
}

# Send the message to the channel
New-MgTeamChannelMessage -TeamId $($team.id) -ChannelId $($team.channel) -BodyParameter $message

# Disconnect from Microsoft Graph
Disconnect-MgGraph
```

## Send channel post with certificate

```powershell
# Set your Azure AD app details
$app = @{
    clientID = ""
    tenantID = ""
    certThumbprint = ""
}
$Cert = Get-ChildItem "Cert:\CurrentUser\My\$($app.certThumbprint)"

# Team and channel ID
$team = @{
    id = ""
    channel = ""
}

# Connect to Microsoft Graph
Connect-MgGraph -NoWelcome -ClientID $($app.clientID) -TenantId $($app.tenantID) -Certificate $Cert

# Set the message content
$messageContent = "Hello, this is a private message sent via PowerShell and Microsoft Graph."

# Create the message
$message = @{
    body = @{
        content = $messageContent
    }
}

# Send the message to the channel
New-MgTeamChannelMessage -TeamId $($team.id) -ChannelId $($team.channel) -BodyParameter $message

# Disconnect from Microsoft Graph
Disconnect-MgGraph
```

## Send channel post with Get-Credential

```powershell
# Tenant
$app = @{
    clientID = ""
    tenantID = ""
    clientSecret = ''
}

# Team and channel IDs
# Test
$team = @{
    id = ""
    channel = ""
}

# Create a PSCredential object
$ClientSecretCredential = Get-Credential -Credential $($app.clientID)

# Connect to Microsoft Graph
Connect-MgGraph -TenantId $($app.tenantID) -ClientSecretCredential $ClientSecretCredential

# Set the message content
$messageContent = "Hello, this is a private message sent via PowerShell and Microsoft Graph."

# Create the message
$message = @{
    body = @{
        content = $messageContent
    }
}

# Send the message to the channel
New-MgTeamChannelMessage -TeamId $($team.id) -ChannelId $($team.channel) -BodyParameter $message

# Disconnect from Microsoft Graph
Disconnect-MgGraph
```

## Send channel post with Invoke-MgGraphRequest

```powershell
$Card = '{
    "type": "message",
    "attachments":[
       {
            "contentType":"application/vnd.microsoft.card.adaptive",
            "content": {
                "type": "AdaptiveCard",
                "$schema": "https://adaptivecards.io/schemas/adaptive-card.json",
                "version": "1.4",
                "body": [
                    {
                        "type": "TextBlock",
                        "text": "Title",
                        "weight": "Bolder",
                        "size": "Large"
                    },
                    {
                        "type": "TextBlock",
                        "text": "Text",
                        "wrap": true
                    }
                ]
            }
        }
    ]
}'

# Webhook to post the adaptive card to - each team channel will have a different webhook
$WebHook = ""

# Connect to the Microsoft Graph PowerShell SDK with the permission to read service health data
Connect-MgGraph -NoWelcome

Try {
    Invoke-MgGraphRequest -uri $WebHook -Method Post -body $Card
    Write-Host "Successfully posted to Teams channel"
} Catch {
    Write-Host "Failed to post adaptive card to webhook: $_"
}

# Disconnect from Microsoft Graph
Disconnect-MgGraph

## Send channel post with token

```powershell
# Set your Azure AD app details
$app = @{
    clientID = ""
    tenantID = ""
    clientSecret = ""
}

# Team and channel ID
# Test
$team = @{
    id = ""
    channel = ""
}

$body = "grant_type=client_credentials&client_id=$($app.clientID)&client_secret=$($app.clientSecret)&scope=https%3A%2F%2Fgraph.microsoft.com%2F.default"
$authUri = "https://login.microsoftonline.com/$($app.tenantID)/oauth2/v2.0/token"
$response = Invoke-RestMethod $authUri -Method 'POST' -Headers $headers -Body $body
$token = $response.access_token
# Convert token to secure string
$secureToken = ConvertTo-SecureString $token -AsPlainText -Force

# Connect to Microsoft Graph
Connect-MgGraph -NoWelcome -AccessToken $secureToken

# Set the message content
$messageContent = "Hello, this is a private message sent via PowerShell and Microsoft Graph."

# Create the message
$message = @{
    body = @{
        content = $messageContent
    }
}

# Send the message to the channel
New-MgTeamChannelMessage -TeamId $($team.id) -ChannelId $($team.channel) -BodyParameter $message

# Disconnect from Microsoft Graph
Disconnect-MgGraph
```

## Send channel post with token and Invoke-MgGraphRequest

```powershell
# Set your Azure AD app details
$app = @{
    clientID = ""
    tenantID = ""
    clientSecret = ""
    WebHook = ""
}

# Create the message
$Card = '{
    "type": "AdaptiveCard",
    "attachments":[
       {
            "contentType":"application/vnd.microsoft.card.adaptive",
            "content": {
                "type": "AdaptiveCard",
                "$schema": "https://adaptivecards.io/schemas/adaptive-card.json",
                "version": "1.4",
                "body": [
                    {
                        "type": "TextBlock",
                        "text": "TitleText",
                        "weight": "Bolder",
                        "size": "Large"
                    },
                    {
                        "type": "TextBlock",
                        "text": "MessageText",
                        "wrap": true
                    }
                ]
            }
        }
    ]
}'

# $Card = $Card.Replace("MessageText",$Message).Replace("TitleText",$Title)

# Get the access token
$body = "grant_type=client_credentials&client_id=$($app.clientID)&client_secret=$($app.clientSecret)&scope=https%3A%2F%2Fgraph.microsoft.com%2F.default"
$authUri = "https://login.microsoftonline.com/$($app.tenantID)/oauth2/v2.0/token"
$response = Invoke-RestMethod $authUri -Method 'POST' -Headers $headers -Body $body
# Convert token to secure string
$secureToken = ConvertTo-SecureString $($response.access_token) -AsPlainText -Force

try {
    # Connect to Microsoft Graph
    Connect-MgGraph -NoWelcome -AccessToken $secureToken

    try {
        # Post the message to the channel
        Invoke-MgGraphRequest -uri $($app.WebHook) -Method Post -body $Card
        Write-Host "Successfully posted to Teams channel"
    } catch {
        Write-Host "Failed to post adaptive card to webhook: $_"
    }

} catch {
    Write-Host "Failed to connect to Microsoft Graph: $_"
}
finally {
    # Disconnect from Microsoft Graph
    Disconnect-MgGraph
}
```

## Send chat message

```powershell
# Connect to Microsoft Graph
Connect-MgGraph -NoWelcome -Scopes "Chat.Create", "Chat.ReadWrite"

# Users
$currentUser = Get-MgContext | Select-Object -ExpandProperty Account
$recipientUPN = "user@company.domain"

# Set the message content
$messageContent = "Hello, this is a private message sent via PowerShell and Microsoft Graph."

# Create a new chat
$chat = New-MgChat -ChatType OneOnOne -Members @(
    @{
        "@odata.type" = "#microsoft.graph.aadUserConversationMember"
        "roles" = @("owner")
        "user@odata.bind" = "https://graph.microsoft.com/v1.0/users/$currentUser"
    },
    @{
        "@odata.type" = "#microsoft.graph.aadUserConversationMember"
        "roles" = @("owner")
        "user@odata.bind" = "https://graph.microsoft.com/v1.0/users/$recipientUPN"
    }
)

# Send the message to the chat
New-MgChatMessage -ChatId $chat.Id -Body @{
    Content = $messageContent
}

# Disconnect from Microsoft Graph
Disconnect-MgGraph
```

## Send chat message with token

```powershell
# Set your Azure AD app details
$clientId = ""
$tenantId = ""
$clientSecret = ""

$headers = @{
    "Content-Type" = "application/x-www-form-urlencoded"
}
$body = "grant_type=client_credentials&client_id=$ClientId&client_secret=$ClientSecret&scope=https%3A%2F%2Fgraph.microsoft.com%2F.default"
$authUri = "https://login.microsoftonline.com/$tenantid/oauth2/v2.0/token"
$response = Invoke-RestMethod $authUri  -Method 'POST' -Headers $headers -Body $body
$token = $response.access_token
# Convert token to secure string
$secureToken = ConvertTo-SecureString $token -AsPlainText -Force

Connect-MgGraph -NoWelcome -AccessToken $secureToken

# Users
$currentUser = Get-MgContext | Select-Object -ExpandProperty Account
$recipientUPN = "user@company.domain"

# Set the message content
$messageContent = "Hello, this is a private message sent via PowerShell and Microsoft Graph."

# Create a new chat
$chat = New-MgChat -ChatType OneOnOne -Members @(
    @{
        "@odata.type" = "#microsoft.graph.aadUserConversationMember"
        "roles" = @("owner")
        "user@odata.bind" = "https://graph.microsoft.com/v1.0/users/$currentUser"
    },
    @{
        "@odata.type" = "#microsoft.graph.aadUserConversationMember"
        "roles" = @("owner")
        "user@odata.bind" = "https://graph.microsoft.com/v1.0/users/$recipientUPN"
    }
)

# Send the message to the chat
New-MgChatMessage -ChatId $chat.Id -Body @{
    Content = $messageContent
}

# Disconnect from Microsoft Graph
Disconnect-MgGraph
```

## Send message with plain text

```powershell
# Description: This script is used to send an AdaptiveCard message to a Teams channel via a webhook.
$Workflow = ""

# Create AdaptiveCard template
$AdaptiveCardObj = @{
    type = "AdaptiveCard"
    attachments = @(
        @{
            contentType = "application/vnd.microsoft.card.adaptive"
            content = @{
                type = "AdaptiveCard"
                '$schema' = "https://adaptivecards.io/schemas/adaptive-card.json"
                version = "1.4"
                msteams = @{
                    width = "Full"
                }
                body = @(
                    @{
                        type = "TextBlock"
                        text = "**Title** Text Текст"
                        weight = "Bolder"
                        size = "Large"
                        wrap = $true
                    }
                )
            }
        }
    )
}

function TeamsMessage {
    param (
        [string]$Workflow,
        [object]$AdaptiveCard
    )

    $AdaptiveCardJson = $AdaptiveCard | ConvertTo-Json -Depth 10
    Invoke-RestMethod -Uri $Workflow -Method Post -Body $AdaptiveCardJson -ContentType 'application/json; charset=utf-8'
}

TeamsMessage -Workflow $Workflow -AdaptiveCard $AdaptiveCardObj
```

## Template AdaptiveCard

```powershell
# Description: This script is used to send an AdaptiveCard message to a Teams channel via a webhook.
$Workflow = ""

# Create AdaptiveCard template
$AdaptiveCardObj = @{
    type = "AdaptiveCard"
    attachments = @(
        @{
            contentType = "application/vnd.microsoft.card.adaptive"
            content = @{
                type = "AdaptiveCard"
                '$schema' = "https://adaptivecards.io/schemas/adaptive-card.json"
                version = "1.4"
                msteams = @{
                    width = "Full"
                }
                body = @( )
            }
        }
    )
}

# # Add status line to AdaptiveCard
# $severityLineColorsVert = @(
#     'data:image/gif;base64,R0lGODdhCAABAIEAAMPDwwAAAAAAAAAAACwAAAAACAABAAAIBwABCBwoMCAAOw==', # 0 - Not classified
#     'data:image/gif;base64,R0lGODdhCAABAIEAALaz/wAAAAAAAAAAACwAAAAACAABAAAIBwABCBwoMCAAOw==', # 1 - Information
#     'data:image/gif;base64,R0lGODdhCAABAIEAAO7JUwAAAAAAAAAAACwAAAAACAABAAAIBwABCBwoMCAAOw==', # 2 - Warning
#     'data:image/gif;base64,R0lGODdhCAABAIEAAOaDAAAAAAAAAAAAACwAAAAACAABAAAIBwABCBwoMCAAOw==', # 3 - Average
#     'data:image/gif;base64,R0lGODdhCAABAIEAAOZNAAAAAAAAAAAAACwAAAAACAABAAAIBwABCBwoMCAAOw==', # 4 - High
#     'data:image/gif;base64,R0lGODdhCAABAIEAAOYAAAAAAAAAAAAAACwAAAAACAABAAAIBwABCBwoMCAAOw==', # 5 - Disaster
#     'data:image/gif;base64,R0lGODdhCAABAIEAAACeGgAAAAAAAAAAACwAAAAACAABAAAIBwABCBwoMCAAOw==', # 6 - Resolved
#     'data:image/gif;base64,R0lGODdhCAABAIEAAMPDwwAAAAAAAAAAACwAAAAACAABAAAIBwABCBwoMCAAOw=='  # 7 - Default
# )
# $severityLineColorsHor = @(
#     'data:image/gif;base64,R0lGODdhAQAIAIEAAMPDwwAAAAAAAAAAACwAAAAAAQAIAAAIBwABCBwoMCAAOw==', # 0 - Not classified
#     'data:image/gif;base64,R0lGODdhAQAIAIEAALaz/wAAAAAAAAAAACwAAAAAAQAIAAAIBwABCBwoMCAAOw==', # 1 - Information
#     'data:image/gif;base64,R0lGODdhAQAIAIEAAO7JUwAAAAAAAAAAACwAAAAAAQAIAAAIBwABCBwoMCAAOw==', # 2 - Warning
#     'data:image/gif;base64,R0lGODdhAQAIAIEAAOaDAAAAAAAAAAAAACwAAAAAAQAIAAAIBwABCBwoMCAAOw==', # 3 - Average
#     'data:image/gif;base64,R0lGODdhAQAIAIEAAOZNAAAAAAAAAAAAACwAAAAAAQAIAAAIBwABCBwoMCAAOw==', # 4 - High
#     'data:image/gif;base64,R0lGODdhAQAIAIEAAOYAAAAAAAAAAAAAACwAAAAAAQAIAAAIBwABCBwoMCAAOw==', # 5 - Disaster
#     'data:image/gif;base64,R0lGODdhAQAIAIEAAACeGgAAAAAAAAAAACwAAAAAAQAIAAAIBwABCBwoMCAAOw==', # 6 - Resolved
#     'data:image/gif;base64,R0lGODdhAQAIAIEAAMPDwwAAAAAAAAAAACwAAAAAAQAIAAAIBwABCBwoMCAAOw=='  # 7 - Default
# )
# $lineType = "vertical" # or will be horizontal
# $severityAdaptiveCard = 1 # 1, 2, 3, 4, 5, 6, 7

# $AdaptiveCardObj.attachments[0].content.backgroundImage += @{
#     url = if ($lineType -eq "vertical") {$severityLineColorsVert[$severityAdaptiveCard]} else {$severityLineColorsHor[$severityAdaptiveCard]}
#     fillMode = if ($lineType -eq "vertical") {"RepeatVertically"} else {"RepeatHorizontally"}
#     # url = "https://adaptivecards.io/content/cats/1.png"
#     # fillMode = ""
# }

# Add text to AdaptiveCard
$AdaptiveCardObj.attachments[0].content.body += @{
    type = "TextBlock"
    text = "**Title** Text"
    weight = "Bolder"
    size = "Large"
    wrap = $true
}

# Add multiline text to AdaptiveCard
$AdaptiveCardObj.attachments[0].content.body += @{
    type = "RichTextBlock"
    inlines = @(
        @{
            type = "TextRun"
            text = "New RichTextBlock \n New line"
        }
    )
}

# Add hyperlink in RichTextBlock to AdaptiveCard
$AdaptiveCardObj.attachments[0].content.body += @{
    type = "RichTextBlock"
    inlines = @(
        @{
            type = "TextRun"
            text = "New RichTextBlock"
            selectAction = @{
                type = "Action.OpenUrl"
                url = "https://google.com"
            }
        }
    )
}

# Add image to AdaptiveCard
$AdaptiveCardObj.attachments[0].content.body += @{
    type = "Image"
    url = "https://adaptivecards.io/content/cats/1.png"
    # url = "data:image/png;base64,iVBORw0KGg..."
    size = "small"
}

# Add columns to AdaptiveCard
$AdaptiveCardObj.attachments[0].content.body += @{
    type = "ColumnSet"
    columns = @(
        @{
            type = "Column"
            width = "auto"
            items = @(
                @{
                    type = "Image"
                    url = "https://adaptivecards.io/content/cats/1.png"
                    horizontalAlignment = "Left"
                    width = "22px"
                }
            )
        },
        @{
            type = "Column"
            width = "stretch"
            items = @(
                @{
                    type = "TextBlock"
                    text = "Example"
                    wrap = $true
                }
            )
        }
    )
}


$AdaptiveCardObj.attachments[0].content.body += @{
    type = "FactSet"
    facts = @(
        @{
            title = "Fact 1"
            value = "Value 1"
        },
        @{
            title = "Fact 2"
            value = "Value 2"
        }
    )
}


function TeamsMessage {
    param (
        [string]$Workflow,
        [string]$AdaptiveCardSeverity,
        [string]$AdaptiveCardSeverityLine,
        [object]$AdaptiveCard
    )

    # Add status line to AdaptiveCard
    $severityLineColorsVert = @(
        'data:image/gif;base64,R0lGODdhCAABAIEAAMPDwwAAAAAAAAAAACwAAAAACAABAAAIBwABCBwoMCAAOw==', # 0 - Not classified
        'data:image/gif;base64,R0lGODdhCAABAIEAALaz/wAAAAAAAAAAACwAAAAACAABAAAIBwABCBwoMCAAOw==', # 1 - Information
        'data:image/gif;base64,R0lGODdhCAABAIEAAO7JUwAAAAAAAAAAACwAAAAACAABAAAIBwABCBwoMCAAOw==', # 2 - Warning
        'data:image/gif;base64,R0lGODdhCAABAIEAAOaDAAAAAAAAAAAAACwAAAAACAABAAAIBwABCBwoMCAAOw==', # 3 - Average
        'data:image/gif;base64,R0lGODdhCAABAIEAAOZNAAAAAAAAAAAAACwAAAAACAABAAAIBwABCBwoMCAAOw==', # 4 - High
        'data:image/gif;base64,R0lGODdhCAABAIEAAOYAAAAAAAAAAAAAACwAAAAACAABAAAIBwABCBwoMCAAOw==', # 5 - Disaster
        'data:image/gif;base64,R0lGODdhCAABAIEAAACeGgAAAAAAAAAAACwAAAAACAABAAAIBwABCBwoMCAAOw==', # 6 - Resolved
        'data:image/gif;base64,R0lGODdhCAABAIEAAMPDwwAAAAAAAAAAACwAAAAACAABAAAIBwABCBwoMCAAOw=='  # 7 - Default
    )
    $severityLineColorsHor = @(
        'data:image/gif;base64,R0lGODdhAQAIAIEAAMPDwwAAAAAAAAAAACwAAAAAAQAIAAAIBwABCBwoMCAAOw==', # 0 - Not classified
        'data:image/gif;base64,R0lGODdhAQAIAIEAALaz/wAAAAAAAAAAACwAAAAAAQAIAAAIBwABCBwoMCAAOw==', # 1 - Information
        'data:image/gif;base64,R0lGODdhAQAIAIEAAO7JUwAAAAAAAAAAACwAAAAAAQAIAAAIBwABCBwoMCAAOw==', # 2 - Warning
        'data:image/gif;base64,R0lGODdhAQAIAIEAAOaDAAAAAAAAAAAAACwAAAAAAQAIAAAIBwABCBwoMCAAOw==', # 3 - Average
        'data:image/gif;base64,R0lGODdhAQAIAIEAAOZNAAAAAAAAAAAAACwAAAAAAQAIAAAIBwABCBwoMCAAOw==', # 4 - High
        'data:image/gif;base64,R0lGODdhAQAIAIEAAOYAAAAAAAAAAAAAACwAAAAAAQAIAAAIBwABCBwoMCAAOw==', # 5 - Disaster
        'data:image/gif;base64,R0lGODdhAQAIAIEAAACeGgAAAAAAAAAAACwAAAAAAQAIAAAIBwABCBwoMCAAOw==', # 6 - Resolved
        'data:image/gif;base64,R0lGODdhAQAIAIEAAMPDwwAAAAAAAAAAACwAAAAAAQAIAAAIBwABCBwoMCAAOw=='  # 7 - Default
    )

    $AdaptiveCardObj.attachments[0].content.backgroundImage += @{
        url = if ($AdaptiveCardSeverityLine -eq "vertical") {$severityLineColorsVert[$AdaptiveCardSeverity]} else {$severityLineColorsHor[$AdaptiveCardSeverity]}
        fillMode = if ($AdaptiveCardSeverityLine -eq "vertical") {"RepeatVertically"} else {"RepeatHorizontally"}
    }

    $AdaptiveCardJson = $AdaptiveCard | ConvertTo-Json -Depth 10

    try {
        Invoke-RestMethod -Uri $Workflow -Method Post -Body $AdaptiveCardJson -ContentType 'application/json; charset=utf-8'
        Write-Output "Successfully posted to Teams channel"
    }
    catch {
        Write-Error "Error posting to Teams channel: $_"
    }
}

TeamsMessage -Workflow $Workflow `
    -AdaptiveCardSeverity $AdaptiveCardSeverity `
    -AdaptiveCardSeverityLine $AdaptiveCardSeverityLine `
    -AdaptiveCard $AdaptiveCardObj
```

## Template not adaptive card

```powershell
$appEntra = @{
    clientID = ""
    tenantID = ""
    clientSecret = ""
    WebHook = ""
}

function TeamsMessage {
    param (
        [string]$clientID,
        [string]$tenantID,
        [string]$clientSecret,
        [string]$WebhookURL,
        [string]$Title,
        [string]$Message
    )

    $TextForMessage = ' {
        "type": "AdaptiveCard",
        "attachments":[
           {
                "$title": "TitleText",
                "$message": "MessageText",
                "contentType":"application/vnd.microsoft.card.adaptive",
                "content": {
                    "type": "AdaptiveCard",
                    "$schema": "https://adaptivecards.io/schemas/adaptive-card.json",
                    "version": "1.4",
                    "body": [
                        {
                            "type": "TextBlock",
                            "text": "TitleText",
                            "weight": "Bolder",
                            "size": "Large"
                        },
                        {
                            "type": "TextBlock",
                            "text": "MessageText",
                            "wrap": true
                        }
                    ]
                }
            }
        ]
    }'

    $TextForMessage = $TextForMessage.Replace("MessageText",$Message).Replace("TitleText",$Title)
    $body = "grant_type=client_credentials&client_id=$($clientID)&client_secret=$($clientSecret)&scope=https%3A%2F%2Fgraph.microsoft.com%2F.default"
    $authUri = "https://login.microsoftonline.com/$($tenantID)/oauth2/v2.0/token"

    try {
        $response = Invoke-RestMethod $authUri -Method 'POST' -Headers $headers -Body $body
        $secureToken = ConvertTo-SecureString $($response.access_token) -AsPlainText -Force

        try {
            Connect-MgGraph -NoWelcome -AccessToken $secureToken

            try {
                Invoke-MgGraphRequest -uri $WebhookURL -Method Post -body $TextForMessage
                Write-Host "Successfully posted to Teams channel"
            } catch {
                Write-Warning "Error post to Teams channel"
            }
        } catch {
            Write-Warning "Error connect to Microsoft Graph"
        }
        finally {
            Disconnect-MgGraph
        }
    }
    catch {
        Write-Warning "Error get token"
    }
}

TeamsMessage -clientID $($appEntra.clientID) `
    -tenantID $($appEntra.tenantID) `
    -clientSecret $($appEntra.clientSecret) `
    -WebhookURL $($appEntra.WebHook) `
    -Title $TitleText `
    -Message $Message
```
