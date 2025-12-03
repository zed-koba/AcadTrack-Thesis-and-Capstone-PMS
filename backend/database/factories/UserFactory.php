<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $year = fake()->numberBetween(20,25);
        $number = fake()->unique()->numberBetween(2000000, 2999999);
        return [
            'email' => fake()->unique()->safeEmail(),
            'program' => fake()->randomElement(['BSCS', 'BSIT', 'BSIS']),
            'student_id' => "{$year}-{$number}",
            'section' => fake()->randomElement(['CS801', 'CS701', 'CpE702', 'IT504']),
            'password' => Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
