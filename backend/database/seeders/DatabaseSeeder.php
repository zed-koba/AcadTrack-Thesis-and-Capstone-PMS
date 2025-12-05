<?php

namespace Database\Seeders;

use App\Models\StudentAccounts;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    //use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        //User::factory(1)->create(1);

        /*StudentsAccount::factory()->create([
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'student_id' => 'ADMIN-000000',
            'program' => 'ADMIN',
            'section' => 'ADMIN',
            'remember_token' => null,
        ]);*/
        //$this->call(AccountsSeeder::class);
        $this->call(ProponentSeeder::class);
    }
}
