<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        $customers = [
            [
                'name' => 'Alice Johnson',
                'email' => 'alice@customer.com',
                'phone' => '1234567890',
            ],
            [
                'name' => 'Bob Smith',
                'email' => 'bob@customer.com',
                'phone' => '2345678901',
            ],
            [
                'name' => 'Carol White',
                'email' => 'carol@customer.com',
                'phone' => '3456789012',
            ],
            [
                'name' => 'David Brown',
                'email' => 'david@customer.com',
                'phone' => '4567890123',
            ],
            [
                'name' => 'Eve Wilson',
                'email' => 'eve@customer.com',
                'phone' => '5678901234',
            ],
        ];

        foreach ($customers as $customer) {
            Customer::create($customer);
        }
    }
}
