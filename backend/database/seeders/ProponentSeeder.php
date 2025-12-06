<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Proponents;
use App\Models\ProponentsDetails;

class ProponentSeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {
    //
    $proponent = Proponents::create([
      'academic_yr' => '2024-2025',
      'semester' => 2,
      'title' => 'Sample Thesis',
      'adviser' => 'Prof. Dela Cruz',
      'program' => 'BSCS',
    ]);

    ProponentsDetails::create([
      'foreign_proponents_id' => $proponent->proponents_id,
      'name' => 'Student One',
    ]);

    ProponentsDetails::create([
      'foreign_proponents_id' => $proponent->proponents_id,
      'name' => 'Student Two',
    ]);

    ProponentsDetails::create([
      'foreign_proponents_id' => $proponent->proponents_id,
      'name' => 'Student Three',
    ]);
  }
}
