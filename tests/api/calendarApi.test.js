import calendarApi from "../../src/api/calendarApi";

describe('Tests Calendar API', () => {
    test('debe tener la configuracion por defecto', () => {
        expect(calendarApi.defaults.baseURL).toBe(process.env.VITE_API_URL);
    });

    test('debe tener un header con el x-token', async () => {
        const token = 'ABC-123-XYZ';
        localStorage.setItem('token', token);

        const res = await calendarApi.post('/auth', {
            email: 'test@gmail.com',
            password: '12345678'
        });

        expect(res.config.headers['x-token']).toBe(token);
    });
});