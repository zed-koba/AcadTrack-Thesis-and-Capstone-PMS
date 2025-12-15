<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Students>
 */
class StudentsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'student_id' => $this->faker->unique()->numerify('2#-#######'),
            'program' => 'BSIT',
            'section' => 'A',
            'mobile_num' => '09' . $this->faker->numberBetween(100000000, 999999999),
            'semester' => $this->faker->numberBetween(1, 2),
            'facebook_profile' => null,
            'year_level' => 4,
            'thesis_title' => 'Web-Based Academic Tracking System',
            'role' => $this->faker->randomElement([
                'not assigned',
                'programmer',
                'database',
                'user interface',
                'system analyst',
            ]),
        ];
    }
}
