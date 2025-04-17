<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

class AuthController extends AbstractController
{
    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(Request $request, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        // Validar datos
        if (empty($data['email']) || empty($data['username']) || empty($data['password']) || empty($data['fullName']) || 
            empty($data['phone']) || empty($data['birthdate'])) {
            return $this->json(['error' => 'Faltan datos obligatorios'], Response::HTTP_BAD_REQUEST);
        }

        // Validar formato de email
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            return $this->json(['error' => 'El formato del email no es válido'], Response::HTTP_BAD_REQUEST);
        }
        
        // Comprobar si el usuario ya existe
        $existingUser = $entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);
        if ($existingUser) {
            return $this->json(['error' => 'El email ya está en uso'], Response::HTTP_CONFLICT);
        }
        
        try {
            // Crear usuario
            $user = new User();
            $user->setEmail($data['email']);
            $user->setUsername($data['username']);
            
            // Hash de la contraseña
            $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
            $user->setPassword($hashedPassword);
            
            // Establecer rol de usuario
            $user->setRoles(['ROLE_USER']);
            
            // Datos adicionales
            $user->setFullName($data['fullName']);
            $user->setPhone($data['phone']);
            
            // Convertir string a objeto DateTime para birthdate
            $birthdate = new \DateTime($data['birthdate']);
            $user->setBirthdate($birthdate);
            
            // Guardar usuario
            $entityManager->persist($user);
            $entityManager->flush();
            
            return $this->json([
                'message' => 'Usuario registrado correctamente',
                'user' => [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'username' => $user->getUsername(),
                    'fullName' => $user->getFullName()
                ]
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Error al registrar el usuario: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
public function login(
    Request $request, 
    EntityManagerInterface $entityManager,
    UserPasswordHasherInterface $passwordHasher,
    JWTTokenManagerInterface $jwtManager
): JsonResponse {
    $data = json_decode($request->getContent(), true);
    
    // Validar datos
    if (empty($data['email']) || empty($data['password'])) {
        return $this->json(['error' => 'Email y contraseña son obligatorios'], Response::HTTP_BAD_REQUEST);
    }
    
    // Buscar usuario por email
    $user = $entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);
    
    if (!$user || !$passwordHasher->isPasswordValid($user, $data['password'])) {
        return $this->json(['error' => 'Credenciales inválidas'], Response::HTTP_UNAUTHORIZED);
    }
    
    // Generar token JWT
    $token = $jwtManager->create($user);
    
    // Crear la respuesta
    return $this->json([
        'message' => 'Login exitoso',
        'user' => [
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'username' => $user->getUsername(),
            'fullName' => $user->getFullName(),
            'roles' => $user->getRoles()
        ],
        'token' => $token
    ]);

    // return $response;
    // // Configurar la cookie
    // $cookie = Cookie::create('BEARER')
    //     ->withValue($token)
    //     ->withExpires(new \DateTime('+1 hour'))
    //     ->withPath('/')
    //     ->withDomain('localhost')
    //     ->withSecure(false) // false para desarrollo local
    //     ->withHttpOnly(true)
    //     ->withSameSite('lax');
    
    // $response->headers->setCookie($cookie);
    
    // return $response;
}

    #[Route('/api/user', name: 'api_user', methods: ['GET'])]
    public function getUserData(): JsonResponse
    {
        /** @var User|null $user */
        $user = $this->getUser();
        
        if (!$user) {
            return $this->json(['error' => 'User not found'], Response::HTTP_UNAUTHORIZED);
        }
    
        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'username' => $user->getUsername(),
            'fullName' => $user->getFullName(),
            'roles' => $user->getRoles()
        ]);
    }
}