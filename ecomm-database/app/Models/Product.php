<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'category', 'price'];

    public function store(Request $request)
{
    $product = new Product();
    $product->name = $request->name;
    $product->category = $request->category;
    $product->price = $request->price;
    $product->save();

    return response()->json($product);
}
}
