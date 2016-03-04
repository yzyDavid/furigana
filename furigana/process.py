from dict import *


def proc_file(file_origin, file_target):
    assert file_origin != file_target
    fp_origin = open(file_origin, 'r', encoding='utf-8')
    fp_target = open(file_target, 'w', encoding='utf-8')
    for line in fp_origin:
        line_out = proc_line(line)
        fp_target.write(line_out)
    fp_origin.close()
    fp_target.close()


def proc_line(line_in):
    for e in rep_dict:
        if line_in.find(e + '(') != -1:
            continue
        line_in = line_in.replace(e, rep_dict[e])
    return line_in
