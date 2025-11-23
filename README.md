📋 Table of Contents
Features
Technologies Used
Prerequisites
Project Structure
Installation & Setup
Backend Setup (.NET Core)
Frontend Setup (React + Vite)
Configuration
Running the Application
API Endpoints
Usage Guide
Database Schema
Troubleshooting
Contributing
License
✨ Features
Frontend Features
✅ User-friendly registration form with validation
✅ View all registrations in a responsive table
✅ Search and filter functionality
✅ Edit existing registrations via modal
✅ Delete registrations with confirmation dialog
✅ Real-time form validation
✅ Dependent dropdowns (City based on State)
✅ Multiple checkbox selection for property preferences
✅ Responsive design for mobile, tablet, and desktop
✅ Loading states and error handling
✅ Modern and clean UI with gradient themes
Backend Features
✅ RESTful API with complete CRUD operations
✅ Entity Framework Core for database operations
✅ Data validation and error handling
✅ Email uniqueness validation
✅ Search functionality
✅ Swagger/OpenAPI documentation
✅ CORS configuration for frontend integration
✅ Structured error responses
🛠️ Technologies Used
Frontend
React 18 - JavaScript library for building user interfaces
Vite - Next-generation frontend build tool
Axios - Promise-based HTTP client
CSS3 - Modern styling with gradients and animations
Backend
.NET Core 7/8 - Cross-platform framework
Entity Framework Core - Object-relational mapper (ORM)
SQL Server - Relational database
Swagger/OpenAPI - API documentation
📦 Prerequisites
Before you begin, ensure you have the following installed:

For Frontend:
Node.js (v16 or higher)
npm or yarn package manager
For Backend:
.NET Core SDK (v7.0 or higher)
SQL Server (Express or higher)
Visual Studio 2022 or VS Code
Optional:
SQL Server Management Studio (SSMS)
Postman for API testing
📁 Project Structure
text

registration-system/
├── backend/                          # .NET Core Web API
│   ├── Controllers/
│   │   └── RegistrationController.cs
│   ├── Models/
│   │   └── Registration.cs
│   ├── DTOs/
│   │   └── RegistrationDto.cs
│   ├── Data/
│   │   └── ApplicationDbContext.cs
│   ├── Migrations/
│   ├── Program.cs
│   ├── appsettings.json
│   └── RegistrationAPI.csproj
│
└── frontend/                         # React + Vite
    ├── src/
    │   ├── components/
    │   │   ├── RegistrationForm.jsx
    │   │   ├── RegistrationForm.css
    │   │   ├── RegistrationList.jsx
    │   │   ├── RegistrationList.css
    │   │   ├── EditModal.jsx
    │   │   ├── EditModal.css
    │   │   ├── DeleteConfirmation.jsx
    │   │   └── DeleteConfirmation.css
    │   ├── App.jsx
    │   ├── App.css
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
🚀 Installation & Setup
Backend Setup (.NET Core)
Clone the repository
Bash

git clone <your-repository-url>
cd registration-system/backend
Restore NuGet packages
Bash

dotnet restore
Install required packages (if not already in .csproj)
Bash

dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package Microsoft.EntityFrameworkCore.Design
Update database connection string
Edit appsettings.json:

JSON

{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=RegistrationDB;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
For SQL Server with credentials:

JSON

{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=RegistrationDB;User Id=YourUsername;Password=YourPassword;TrustServerCertificate=True;"
  }
}
Create and apply migrations
Bash

# Install EF Core tools globally (if not installed)
dotnet tool install --global dotnet-ef

# Create migration
dotnet ef migrations add InitialCreate

# Update database
dotnet ef database update
Run the API
Bash

dotnet run
The API should now be running at:

HTTPS: https://localhost:7XXX (check console output for exact port)
HTTP: http://localhost:5XXX
Swagger UI: https://localhost:7XXX/swagger
Frontend Setup (React + Vite)
Navigate to frontend directory
Bash

cd ../frontend
Install dependencies
Bash

npm install
Install Axios (if not in package.json)
Bash

npm install axios
Update API URL
Edit the API URL in the following files to match your backend port:

src/components/RegistrationForm.jsx
src/components/RegistrationList.jsx
JavaScript

const API_URL = 'https://localhost:7XXX/api/Registration'; // Replace 7XXX with your port
Run the development server
Bash

npm run dev
The frontend should now be running at:

http://localhost:5173
⚙️ Configuration
Backend Configuration
appsettings.json

JSON

{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=RegistrationDB;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
CORS Configuration (Program.cs)
Already configured to allow React app:

csharp

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});
Frontend Configuration
Update API endpoints in:

RegistrationForm.jsx
RegistrationList.jsx
JavaScript

const API_URL = 'https://localhost:7XXX/api/Registration';
🎮 Running the Application
Step-by-Step:
Start the Backend
Bash

cd backend
dotnet run
Note the HTTPS port (e.g., https://localhost:7123)

Start the Frontend
Bash

cd frontend
npm run dev
Access the Application
Frontend: http://localhost:5173
Backend API: https://localhost:7XXX
Swagger Documentation: https://localhost:7XXX/swagger
📡 API Endpoints
Base URL
text

https://localhost:7XXX/api/Registration
Endpoints
Method	Endpoint	Description
GET	/api/Registration	Get all registrations
GET	/api/Registration/{id}	Get registration by ID
POST	/api/Registration	Create new registration
PUT	/api/Registration/{id}	Update existing registration
DELETE	/api/Registration/{id}	Delete registration
GET	/api/Registration/search?email={email}&state={state}&city={city}	Search registrations
Request/Response Examples
POST /api/Registration (Create)

JSON

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "gender": "male",
  "state": "Maharashtra",
  "city": "Mumbai",
  "preferences": ["1bhk", "2bhk", "rk"]
}
Response (Success - 201 Created)

JSON

{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "gender": "male",
  "state": "Maharashtra",
  "city": "Mumbai",
  "preferences": ["1bhk", "2bhk", "rk"],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": null
}
PUT /api/Registration/1 (Update)

JSON

{
  "name": "John Doe Updated",
  "email": "john.doe@example.com",
  "gender": "male",
  "state": "Maharashtra",
  "city": "Pune",
  "preferences": ["2bhk", "3bhk"]
}
Response (Success - 200 OK)

JSON

{
  "message": "Registration updated successfully",
  "id": 1
}
📖 Usage Guide
Creating a New Registration
Click on "📝 New Registration" tab
Fill in all required fields:
Name
Email
Gender (Male/Female/Other)
State (select from dropdown)
City (select based on state)
Property Preferences (select at least one)
Click "Register" button
Success message will appear on successful registration
Viewing All Registrations
Click on "📋 View All Records" tab
All registrations will be displayed in a table
Use the search box to filter by name, email, city, or state
Click "🔄 Refresh" to reload data
Editing a Registration
In the records table, click "✏️ Edit" button for the desired record
Edit modal will appear with pre-filled data
Modify the required fields
Click "Update" to save changes
Click "Cancel" to discard changes
Deleting a Registration
In the records table, click "🗑️ Delete" button
Confirmation dialog will appear
Review the details
Click "Delete" to confirm or "Cancel" to abort
🗄️ Database Schema
Registrations Table
Column	Type	Constraints
Id	int	Primary Key, Identity
Name	nvarchar(100)	Not Null
Email	nvarchar(100)	Not Null, Unique
Gender	nvarchar(20)	Not Null
State	nvarchar(50)	Not Null
City	nvarchar(50)	Not Null
Preferences	nvarchar(MAX)	Not Null
CreatedAt	datetime2	Default: GETUTCDATE()
UpdatedAt	datetime2	Nullable
Indexes:

Primary Key on Id
Unique Index on Email
🐛 Troubleshooting
Common Issues
1. Database Connection Failed

text

Solution: 
- Verify SQL Server is running
- Check connection string in appsettings.json
- Ensure Windows Authentication or correct credentials
- Run: dotnet ef database update
2. CORS Error in Browser

text

Solution:
- Check CORS policy in Program.cs
- Ensure frontend URL is in allowed origins
- Verify API is running on correct port
3. Port Already in Use

text

Solution (Backend):
- Change port in Properties/launchSettings.json

Solution (Frontend):
- Change port in vite.config.js or use --port flag
- npm run dev -- --port 3000
4. Migration Errors

Bash

# Reset database
dotnet ef database drop
dotnet ef migrations remove
dotnet ef migrations add InitialCreate
dotnet ef database update
5. API Not Reachable

text

Solution:
- Check if backend is running
- Verify HTTPS certificate is trusted
- Update API_URL in frontend components
- Check firewall settings
Verify Setup
Backend Health Check:

Bash

# Navigate to Scaler UI
https://localhost:7XXX/Scaler

# Test GET endpoint
curl https://localhost:7XXX/api/Registration
Frontend Health Check:

Open browser developer console (F12)
Check for any error messages
Verify API calls in Network tab
🔒 Environment Variables
Backend (.NET)
Create appsettings.Development.json for development settings:

JSON

{
  "ConnectionStrings": {
    "DefaultConnection": "Your-Development-Connection-String"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Debug"
    }
  }
}
Frontend (React)
Create .env file in frontend root:

env

VITE_API_URL=https://localhost:7XXX/api
Use in code:

JavaScript

const API_URL = `${import.meta.env.VITE_API_URL}/Registration`;
📝 Build for Production
Backend
Bash

cd backend
dotnet publish -c Release -o ./publish
Frontend
Bash

cd frontend
npm run build
The production build will be in the dist/ folder.

🤝 Contributing
Contributions are welcome! Please follow these steps:

Fork the repository
Create a feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request
📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

👨‍💻 Author
Mahesh Chaudhari

GitHub: @maheshchaudhari12
Email: maheshchaudhari0612@gmail.com
🙏 Acknowledgments
React and Vite communities
.NET Core documentation
Entity Framework Core team
