<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\StudentAccounts;
use Illuminate\Support\Facades\Hash;

class AccountsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {   
         /*StudentAccounts::create([
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'student_id' => 'ADMIN-000000',
            'program' => 'ADMIN',
            'section' => 'ADMIN',
            'remember_token' => null,
        ]);*/
        StudentAccounts::factory(5)->create();
    }
}
