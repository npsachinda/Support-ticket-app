# Support Ticket System

A modern support ticket management system built with Laravel, React, and Inertia.js. This system allows customers to create support tickets and agents to manage and respond to them.

## Tech Stack

- **Backend:** Laravel 12
- **Frontend:** React 18 with TypeScript
- **Server-Side Rendering:** Inertia.js
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + Shadcn UI
- **Database:** MySQL
- **Authentication:** Laravel Breeze
- **Email:** Laravel Mail

## Features

- **Guest Ticket Creation**
  - Anyone can create a support ticket
  - Unique reference number generation
  - Email notifications
  
- **Agent Dashboard**
  - Secure login system
  - Ticket listing with search and pagination
  - New ticket highlighting
  - Detailed ticket view
  - Reply functionality with email notifications
  
- **Public Ticket Status**
  - Reference number-based status checking
  - View ticket details and agent replies
  
- **Responsive Design**
  - Mobile-first approach
  - Dark/Light theme support

## Prerequisites

- PHP 8.2 or higher
- Node.js 16.0 or higher
- Composer
- MySQL
- Git

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd support-ticket-app
```

2. **Install PHP dependencies**
```bash
composer install
```

3. **Install Node.js dependencies**
```bash
npm install
```

4. **Environment Setup**
```bash
cp .env.example .env
php artisan key:generate
```

5. **Configure your database in .env file**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=support_ticket_app
DB_USERNAME=your_username
DB_PASSWORD=your_password

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="support@example.com"
MAIL_FROM_NAME="${APP_NAME}"
```

6. **Run database migrations and seeders**
```bash
php artisan migrate
php artisan db:seed
```

## Development

1. **Start the Laravel development server**
```bash
php artisan serve
```

2. **Start the Vite development server**
```bash
npm run dev
```

3. **Start Mailpit for email testing**
```bash
# Install Mailpit first if you haven't:
# On macOS: brew install axllent/apps/mailpit
# On Windows: Download from https://github.com/axllent/mailpit/releases
mailpit
```

## Testing the Application

1. **Default Test Accounts**
   - Admin Agent:
     - Email: admin@example.com
     - Password: password
   - Regular Agents:
     - Email: john@example.com
     - Password: password
     - Email: jane@example.com
     - Password: password

2. **Test Flow**
   - Visit the homepage
   - Create a ticket as a guest
   - Note down the reference number
   - Check ticket status using the reference number
   - Login as an agent
   - View and reply to tickets
   - Check email notifications in Mailpit (localhost:8025)

3. **Run Automated Tests**
```bash
php artisan test
```

## Project Structure

```
support-ticket-app/
├── app/
│   ├── Http/Controllers/    # Controllers
│   ├── Models/             # Eloquent Models
│   ├── Mail/              # Mailable Classes
│   ├── Repositories/      # Repository Pattern Implementation
│   └── Services/         # Business Logic Services
├── resources/
│   ├── js/               # React Components
│   │   ├── Components/   # Reusable Components
│   │   ├── Layouts/     # Page Layouts
│   │   └── Pages/       # Page Components
│   └── views/           # Email Templates
└── routes/              # Application Routes
```


## Assumptions Made

1. **Security**
   - Ticket reference numbers are unique and non-sequential
   - Guest users don't need accounts
   - Agents must be authenticated

2. **Business Logic**
   - One customer can have multiple tickets
   - Only agents can reply to tickets
   - All agents can see all tickets
   - Email notifications are required
   - One Agent is only associated to one user account

3. **Technical**
   - SMTP server is available for emails
   - MySQL is the primary database
   - Modern browser support required

## Improvements Made

1. **Code Organization**
   - Implemented Repository Pattern
   - Added Service Layer
   - Separated business logic from controllers

2. **Security**
   - Protected agent routes
   - CSRF protection
   - Validation for all inputs

3. **User Experience**
   - Debounced search
   - Real-time form validation
   - Dark/Light theme support
   - Mobile-responsive design

4. **Performance**
   - Eager loading relationships
   - Pagination for ticket listing
   - Optimized database queries

## Future Improvements

1. **Features**
   - File attachments
   - Rich text editor for replies
   - Customer accounts (optional)
   - Priority levels for tickets
   - Auto-assignment to agents

2. **Technical**
   - Real-time notifications
   - Queue for email sending
   - API documentation
   - More comprehensive tests
   - Docker containerization

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 