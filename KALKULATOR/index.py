def tambah(x, y):
    return x + y

def kurang(x, y):
    return x - y

def kali(x, y):
    return x * y

def bagi(x, y):
    if y == 0:
        return "Error: Tidak bisa membagi dengan nol!"
    return x / y

def pangkat(x, y):
    return x ** y

def akar(x):
    if x < 0:
        return "Error: Tidak bisa akar kuadrat dari angka negatif!"
    return x ** 0.5

def kalkulator():
    print("=" * 40)
    print("KALKULATOR SEDERHANA")
    print("=" * 40)
    
    while True:
        print("\nPilih operasi:")
        print("1. Penjumlahan (+)")
        print("2. Pengurangan (-)")
        print("3. Perkalian (*)")
        print("4. Pembagian (/)")
        print("5. Pangkat (^)")
        print("6. Akar Kuadrat (√)")
        print("7. Keluar")
        
        pilihan = input("\nMasukkan pilihan (1-7): ")
        
        if pilihan == '7':
            print("Terima kasih telah menggunakan kalkulator!")
            break
        
        if pilihan in ['1', '2', '3', '4', '5']:
            try:
                num1 = float(input("Masukkan angka pertama: "))
                num2 = float(input("Masukkan angka kedua: "))
                
                if pilihan == '1':
                    print(f"\nHasil: {num1} + {num2} = {tambah(num1, num2)}")
                elif pilihan == '2':
                    print(f"\nHasil: {num1} - {num2} = {kurang(num1, num2)}")
                elif pilihan == '3':
                    print(f"\nHasil: {num1} × {num2} = {kali(num1, num2)}")
                elif pilihan == '4':
                    hasil = bagi(num1, num2)
                    print(f"\nHasil: {num1} ÷ {num2} = {hasil}")
                elif pilihan == '5':
                    print(f"\nHasil: {num1} ^ {num2} = {pangkat(num1, num2)}")
            except ValueError:
                print("\nError: Masukkan angka yang valid!")
        
        elif pilihan == '6':
            try:
                num = float(input("Masukkan angka: "))
                hasil = akar(num)
                print(f"\nHasil: √{num} = {hasil}")
            except ValueError:
                print("\nError: Masukkan angka yang valid!")
        
        else:
            print("\nPilihan tidak valid! Silakan pilih 1-7.")

# Jalankan kalkulator
if __name__ == "__main__":
    kalkulator()