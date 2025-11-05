#include <iostream>
using namespace std;

int main() {
    int choice;
    float a, b;

    do {
        cout << "\nMenu:\n";
        cout << "1. Addition\n";
        cout << "2. Subtraction\n";
        cout << "3. Multiplication\n";
        cout << "4. Exit\n";
        cout << "Enter your choice: ";
        cin >> choice;

        if (choice >= 1 && choice <= 3) {
            cout << "Enter two numbers: ";
            cin >> a >> b;
        }

        switch (choice) {
            case 1:
                cout << "Result: " << (a + b) << endl;
                break;
            case 2:
                cout << "Result: " << (a - b) << endl;
                break;
            case 3:
                cout << "Result: " << (a * b) << endl;
                break;
            case 4:
                cout << "Exiting...\n";
                break;
            default:
                cout << "Invalid choice\n";
        }

    } while (choice != 4);

    return 0;
}
