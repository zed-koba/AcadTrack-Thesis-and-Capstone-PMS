<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StudentAccounts>
 */
class StudentAccountsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = \App\Models\StudentAccounts::class;
    public function definition(): array
    {
        $year = fake()->numberBetween(20,25);
        $number = fake()->unique()->numberBetween(2000000, 2999999);
        return [
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'program' => fake()->randomElement(['BSCS', 'BSIT', 'BSIS']),
            'student_id' => "{$year}-{$number}",
            'role' => 'student',
            'section' => fake()->randomElement(['CS801', 'CS701', 'CpE702', 'IT504']),
            'remember_token' => Str::random(10),
        ];
    }
}
