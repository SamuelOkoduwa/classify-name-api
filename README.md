# GenderSize - Stage 0 API

Single endpoint service that integrates with Genderize API and returns a processed response.

## Endpoint

`GET /api/classify?name={name}`

### Success Response (`200`)

```json
{
  "status": "success",
  "data": {
    "name": "john",
    "gender": "male",
    "probability": 0.99,
    "sample_size": 1234,
    "is_confident": true,
    "processed_at": "2026-04-01T12:00:00.000Z"
  }
}
```

### Error Response Format

```json
{ "status": "error", "message": "<error message>" }
```

### Status Codes

- `400` Missing or empty `name`
- `422` Non-string `name`
- `422` No prediction available for provided name (`gender: null` or `count: 0`)
- `502` Upstream API failure
- `500` Internal server failure

## Local Setup

1. Install dependencies:
   - `npm install`
2. Start server:
   - `npm start`
3. Development mode:
   - `npm run dev`

Default port is `3000`.

## Quick Test

```bash
curl "http://localhost:3000/api/classify?name=john"
```

## Notes

- CORS is enabled with `Access-Control-Allow-Origin: *`
- `processed_at` is generated dynamically in UTC ISO 8601 format on every request
