# Task Management Application

A full-stack Task Management Application built with Django Rest Framework and React.
![image](https://github.com/user-attachments/assets/d74fe124-8bd1-4804-b518-2a90d36a1ece)


## Features

- User authentication using JWT
- CRUD operations for tasks
- Real-time updates using WebSockets (Django Channels)
- Data visualization for task statistics
- Responsive design

## Tech Stack

### Backend
- Django
- Django Rest Framework
- Django Channels
- PostgreSQL


### Frontend
- React
- Redux
- Axios
- Recharts (for data visualization)
- Tailwind CSS

## Prerequisites

- Python 3.8+
- django
- PostgreSQL


## Setup

### Backend Setup

1. Clone the repository:
   ```
   git clone https://github.com/Arunkino/TaskManagementApp.git
   cd task-management-app
   ```

2. Create a virtual environment and activate it:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Set up the database:
   ```
   python manage.py migrate
   ```

5. Create a superuser:
   ```
   python manage.py createsuperuser
   ```

6. Run the development server (daphne):
   ```
   daphne -b 0.0.0.0 -p 8000 task_management_project.asgi:application
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Change Axios url:
   ```
   open axios config and websocket config.
   change the url to match with backend
   ```
3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm start
   ```

## Running the Application

1. Start the Django development server (from the project root):
   ```
   python manage.py runserver
   ```

2. In a separate terminal, start the React development server (from the frontend directory):
   ```
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Deployment

[Add deployment instructions here once the deployment process is finalized]

## Contributing

[Add contributing guidelines here]

## License

[Add license information here]

## Contact
https://www.linkedin.com/in/arunkino/

