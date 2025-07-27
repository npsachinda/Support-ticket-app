<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,      // First create users
            AgentSeeder::class,     // Then create agents linked to users
            CustomerSeeder::class,  // Create customers
            TicketSeeder::class,    // Finally create tickets and replies
        ]);
    }
}
