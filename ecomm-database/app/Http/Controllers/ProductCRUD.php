<?php
namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductCRUD extends Controller
{
    public function index() {
        return Product::all();
    }

    public function store(Request $request) {
        $product = Product::create($request->all());
        return response()->json($product, 201);
    }

    public function show($id) {
        return Product::findOrFail($id);
    }

   // Update a product
    public function update(Request $request, $id) {
    $product = Product::findOrFail($id);
    $product->update($request->all());
    return response()->json($product, 200);
    }

    // Delete a product
    public function destroy($id) {
    Product::findOrFail($id)->delete();
    return response()->json(null, 204);
    }
}