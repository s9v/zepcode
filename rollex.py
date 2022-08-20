import os
from collections import defaultdict

rootns = defaultdict({})

for root, dirs, files in os.walk('src'):
    print(root, dirs, files)

    for file in files:
        with open(root + '/' + file) as r:
            print(root + '/' + file, "->", r.read())
            f.write()
            f.write(r.read() + '\n')
            root


def nswrite(f, ns, ns_name = None):
    if ns is not None:
        f.write(f'namespace {ns_name} {{\n')

    ns['sub'] 

    f.write()

    if ns is not None:
        f.write(f'namespace {ns_name} {{\n')

with open('cardib.ts', 'w') as f:
    f.write(
'''import 'zep-script';
'''
    )
    nswrite(f, rootns)