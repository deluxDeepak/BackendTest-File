#include <iostream>
#include <string>
using namespace std;

int add(int a, int b) {
    return a + b;
}

int multiply(int a, int b) {
    return a * b;
}

int main(int argc, char* argv[]) {
    if (argc < 4) {
        cout << "Invalid args";
        return 1;
    }

    string operation = argv[1];
    int a = stoi(argv[2]);
    int b = stoi(argv[3]);

    if (operation == "add") {
        cout << add(a, b) << endl;
    } else if (operation == "multiply") {
        cout << multiply(a, b) << endl;
    } else {
        cout << "Unknown operation";
    }

    return 0;
}

