<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE wallet_transactions MODIFY type ENUM('topup', 'purchase', 'refund', 'adjustment') NOT NULL");

        Schema::table('wallet_transactions', function (Blueprint $table) {
            $table->string('reference_no')->nullable()->unique()->after('id');
        });

        DB::table('wallet_transactions')->whereNull('reference_no')->orderBy('id')->each(function ($row) {
            DB::table('wallet_transactions')
                ->where('id', $row->id)
                ->update(['reference_no' => 'UC-'.str_pad((string) $row->id, 8, '0', STR_PAD_LEFT).'-'.strtoupper(substr(md5($row->id.$row->created_at), 0, 6))]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('wallet_transactions', function (Blueprint $table) {
            $table->dropColumn('reference_no');
        });

        DB::statement("ALTER TABLE wallet_transactions MODIFY type ENUM('topup', 'purchase', 'refund') NOT NULL");
    }
};
