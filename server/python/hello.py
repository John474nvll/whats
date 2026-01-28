import sys

def say_hello(name):
    return f"Hello, {name}!"

if __name__ == "__main__":
    name = sys.argv[1]
    print(say_hello(name))
