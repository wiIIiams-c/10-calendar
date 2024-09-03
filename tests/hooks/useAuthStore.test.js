import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "../../src/store";
import { initialState, notAuthenticatedState } from "../fixtures/authStates";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useAuthStore } from "../../src/hooks/useAuthStore";
import { Provider } from "react-redux";
import { testUserCredentials } from "../fixtures/testUser";
import { calendarApi } from "../../src/api";

const getMockStore = (initialState = {}) => {
    return configureStore({
        reducer: {
            auth: authSlice.reducer
        },
        preloadedState: {
            auth: {
                ...initialState
            }
        }
    })
}

describe('Pruebas en useAuthStore', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    test('deberia devolver los valores por defecto', () => {
        const mockStore = getMockStore({...initialState})
        const {result} = renderHook(() => useAuthStore(), {
            wrapper: ({children}) => (
                <Provider store={mockStore}>
                    {children}
                </Provider>
            )
        })

        expect(result.current).toEqual({
            status: 'checking',
            user: {},
            errorMessage: undefined,
            startLogin: expect.any(Function),
            startRegister: expect.any(Function),
            checkAuthToken: expect.any(Function),
            startLogout: expect.any(Function),
        })
    });

    test('deberia de realizar el login', async() => {
        const mockStore = getMockStore({...notAuthenticatedState})
        const {result} = renderHook(() => useAuthStore(), {
            wrapper: ({children}) => (
                <Provider store={mockStore}>
                    {children}
                </Provider>
            )
        })

        await act(async() => {
            await result.current.startLogin(testUserCredentials)
        })

        const {status, user, errorMessage} = result.current

        expect({status, user, errorMessage}).toEqual({
            status: 'authenticated',
            user: {
                uid: testUserCredentials.uid,
                name: testUserCredentials.name
            },
            errorMessage: undefined
        })

        expect(localStorage.getItem('token')).toEqual(expect.any(String))
        expect(localStorage.getItem('token-init-date')).toEqual(expect.any(String))
    })

    test('debe de fallar el login', async() => {
        const mockStore = getMockStore({...notAuthenticatedState})
        const {result} = renderHook(() => useAuthStore(), {
            wrapper: ({children}) => (
                <Provider store={mockStore}>
                    {children}
                </Provider>
            )
        })

        await act(async() => {
            await result.current.startLogin({email: 'waldo@gmail.com', password: '1234567890'})
        })

        const {status, user, errorMessage} = result.current

        expect(localStorage.getItem('token')).toBe(null)
        expect({status, user, errorMessage}).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage: 'Credenciales incorrectas'
        })

        await waitFor(() => {
            expect(result.current.errorMessage).toBe(undefined)
        })
    })

    test('startRegister debe de crear el usuario', async() => {
        const newUser = {email: 'algo@gmail.com', password: '1234567890', name: 'Test Waldo'}
        const mockStore = getMockStore({...notAuthenticatedState})
        const {result} = renderHook(() => useAuthStore(), {
            wrapper: ({children}) => (
                <Provider store={mockStore}>
                    {children}
                </Provider>
            )
        })

        const spy = jest.spyOn(calendarApi, 'post').mockReturnValue({
            data: {
                ok: true,
                uid: 'abc',
                name: newUser.name,
                token: '1234567890'
            }
        })

        await act(async() => {
            await result.current.startRegister(newUser)
        })

        const {status, user, errorMessage} = result.current

        expect({status, user, errorMessage}).toEqual({
            status: 'authenticated',
            user: {
                uid: 'abc',
                name: newUser.name
            },
            errorMessage: undefined
        })

        spy.mockRestore()
    })

    test('startRegister debe de mostrar un error', async() => {
        const mockStore = getMockStore({...notAuthenticatedState})
        const {result} = renderHook(() => useAuthStore(), {
            wrapper: ({children}) => (
                <Provider store={mockStore}>
                    {children}
                </Provider>
            )
        })

        await act(async() => {
            await result.current.startRegister(testUserCredentials)
        })

        const {status, user, errorMessage} = result.current

        expect({status, user, errorMessage}).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage: 'Correo ya existe'
        })
    })

    test('checkAuthStore debe fallar si no hay un token', async() => {
        const mockStore = getMockStore({...initialState})
        const {result} = renderHook(() => useAuthStore(), {
            wrapper: ({children}) => (
                <Provider store={mockStore}>
                    {children}
                </Provider>
            )
        })

        await act(async() => {
            await result.current.checkAuthToken()
        })

        const {status, user, errorMessage} = result.current

        expect({status, user, errorMessage}).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage: undefined
        })
    })

    test('checkAuthStore debe de autenticar el usuario si hay token', async() => {
        const {data} = await calendarApi.post('/auth', testUserCredentials)

        localStorage.setItem('token', data.token)

        const mockStore = getMockStore({...notAuthenticatedState})
        const {result} = renderHook(() => useAuthStore(), {
            wrapper: ({children}) => (
                <Provider store={mockStore}>
                    {children}
                </Provider>
            )
        })

        await act(async() => {
            await result.current.checkAuthToken()
        })

        const {status, user, errorMessage} = result.current

        expect({status, user, errorMessage}).toEqual({
            status: 'authenticated',
            user: {
                uid: data.uid,
                name: data.name
            },
            errorMessage: undefined
        })
    })
});