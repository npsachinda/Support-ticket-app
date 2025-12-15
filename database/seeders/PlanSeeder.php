<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Plan::create([
            'name' => 'Hobby',
            'stripe_plan_id' => 'prod_TbjPS3UH63Q5HQ',
            'stripe_price_id' => 'price_1SeVweKuZ8AQYTI4Cv4XrU2v',
        ]);

        Plan::create([
           'name' => 'Enterprise',
            'stripe_plan_id' => 'prod_TbjQknnmeWWatZ',
            'stripe_price_id' => 'price_1SeVxJKuZ8AQYTI4WePVzwAg',
        ]);
    }
}
