# Student API

Laravel 12 REST API implementing a layered architecture for student records.

## Installation

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan test
php artisan serve
```

Configure `DB_*` values in `.env` before migrating. The included Docker setup can be started with `docker compose up --build`.

## API

All endpoints use the `/api` prefix and return JSON. Student fields are `first_name`, `last_name`, `email`, `age`, `course`, `year_level`, and `status`. Names and courses are strings up to 100 characters; email must be valid and unique; age must be at least 15; year level must be 1 through 4; status is `active` or `inactive`.

| Method | URL | Purpose |
| --- | --- | --- |
| POST | `/api/students` | Create a student; returns `201` and the resource. |
| GET | `/api/students` | Paginated list. Supports `per_page`, `search`, `course`, `status`, and `year_level`. |
| GET | `/api/students/{id}` | Return one student, or `404`. |
| PUT | `/api/students/{id}` | Update supplied fields; current email may be retained. |
| DELETE | `/api/students/{id}` | Delete a student; returns `204`, or `404`. |
| GET | `/api/students/statistics` | Return total, active, and inactive counts. |

Example create request:

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "age": 20,
  "course": "Computer Science",
  "year_level": 2,
  "status": "active"
}
```

Validation errors return `422` with an `errors` object. Missing students return `404` with a message.

## Architecture

- **Controller:** receives HTTP input and delegates to the service.
- **Form Requests:** authorize and validate create/update payloads.
- **Service:** coordinates operations and enforces the reusable minimum-age rule.
- **Repository Interface:** defines data-access operations without Eloquent details.
- **Repository:** performs queries, filtering, pagination, persistence, and statistics.
- **Model:** represents the UUID-backed `students` table.
- **API Resource:** defines the public JSON representation.

For `POST /api/students`, Laravel routes the request to the controller and validates it with `StoreStudentRequest`. The controller passes validated data to `StudentService`, which applies the age rule and calls `StudentRepositoryInterface`. Laravel resolves that interface to `StudentRepository` through `AppServiceProvider`; the repository persists the `Student` model, and the controller returns it through `StudentResource`.

Feature tests cover CRUD, validation, duplicate emails, pagination, filtering, not-found responses, and container binding.