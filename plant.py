# Seedlings_ command interface
# Transplant a word into a new context

import json
import sys
from random import random, shuffle, choice
from datamuse import datamuse
import nltk

api = datamuse.Datamuse()

# Parameters
MAX = 10
SPEED = 50

############# DataMuse API ##############
#rel_bga Frequent followers
#rel_bgb Frequent predecessors
#lc Left Context
#rc right context
#ml means like

# rel_bgb is better than lc
######################################
# Tools

def getData():
    for word in words:
        dict[word] = {}
        for field in FIELDS:
            bga = api.words(rel_bga= word, topics=field, max=MAX)
            dict[word][field+"_bga"] = bga
            lc = api.words(lc= word, topics=field, max=MAX)
            dict[word][field+"_lc"] = lc
            ml = api.words(ml= word, topics=field, max=MAX)
            dict[word][field+"_ml"] = ml
        print('.')

    with open('data.json', 'w') as fp:
        json.dump(dict, fp)

    print("Data saved as data.json!")

def getPosTag(word):
    entry = nltk.pos_tag([word.lower()])
    if len(entry) > 1:
        tag = entry[0][1]
    else:
        tag = ""
    return tag

def getSimilarWord(word, avoid=[]):
    list = api.words(ml=word, max=SPEED)
    word_pos = getPosTag(word)
    for item in list:
        w = item["word"]
        if getPosTag(w) == word_pos and w is not word and " " not in word and w not in avoid:
            return w

def isBad(item, history, domain):
    w = item["word"]
    #
    frequency = float(item["tags"][-1][2:])
    tag = w in history or domain in w or " " in w or frequency < 1 or "-" in w or w in '.?-:;!'
    # if tag: print( w in history, domain in w, " " in w, frequency < 1, tag)
    return tag

def isGood(item, history, domain):
    w = item["word"]
    #
    frequency = float(item["tags"][-1][2:])
    tag = w in history or domain in w or " " in w or frequency > 200 or "-" in w
    # if tag: print( w in history, domain in w, " " in w, frequency < 1, tag)
    return not tag

def reversePrint(toPrint):
    toPrint.reverse()
    for item in toPrint:
        print(item)

######################################
# Plants

def plant(start, domain,pos=""):
    # can only start with jj or nn

    word = start
    history = [word]
    toPrint = []
    context = []

    print("--------------------------------------")
    print("Plant " + start + " in " + domain + ":")

    for i in range(MAX):
        pos = getPosTag(word)

        if pos == "NN" or pos =="NNS":
            # print("CASE", "NN")
            context = api.words(rel_jjb=word, topics=domain, max=SPEED, md="pf")
        elif pos == "JJ":
            # print("CASE", "JJ")
            context = api.words(rel_jja=word, topics=domain, max=SPEED, md="pf")

        if len(context) == 0:
            word = getSimilarWord(word, history)
            context = api.words(rel_jja=word, topics=domain, max=SPEED, md="pf")
            continue

        # random shuffle
        context = context[0:5] # the top 5 most related ones
        shuffle(context) #shuffle for better result

        for item in context:

            if isBad(item, history, domain):
                continue

            pos = item["tags"][0:len(item["tags"])-1]

            if  "adj" in pos :
                next = item["word"]
                history.append(next)
                toPrint.append(next + "|" + word)
                a_next = getSimilarWord(next, history)
                toPrint.append(" "*(len(next)-len(a_next)) + a_next + "\\")
                print(" "*(len(next)-len(a_next)) + a_next + "\\")
                word = a_next
                goal = "n"
                break
            elif "n" in pos:
                next = item["word"]
                history.append(next)
                toPrint.append(word + "|" + next)
                print(word + "|" + next)

                next = getSimilarWord(next, history)
                toPrint.append("/" + next)
                print("/" + next)
                word = next
                goal = ""
                break

    # reversePrint(toPrint)
    return toPrint, word

def ivy(start, domain):
    print("--------------------------------------")
    print("Plant " + start + " in " + domain + " as ivy :")
    word = start
    history = [word]
    context = []
    print(word, end="", flush=True)
    while(True):
        next = api.words(rel_bga=word, topics=domain, max=SPEED, md="pf")
        shuffle(next)
        for item in reversed(next):
            if not isGood(item, history,domain):
                continue
            next = item["word"]
            history.append(next)
            print(" " + next, end="", flush=True)
            word = next
            break
        if word is '.' or ("NN" in getPosTag(word) and len(history) > 5) or len(history) > 13:
            break
    print("")
    if (history[-1] not in ".?!,'"):
         lastword = history[-1]
    else:
        lastword = history[-2]
    return history, lastword

def dandelion(word, domain):
    # rel_trg=cow, words triggered by

    print("--------------------------------------")
    print("Plant " + word + " in " + domain + " as dandelion :")
    history = []
    next = api.words(rel_trg=word, topics=domain, max=SPEED, md="f")
    while(len(next) == 0):
        similar = api.words(ml=word, max=SPEED, md="f")
        word = similar[0]["word"]
        next = api.words(rel_trg=word, topics=domain, max=SPEED, md="f")

    shuffle(next)
    for item in next:
        if isBad(item, history,domain):
            continue
        else:
            w = item["word"]
            history.append(w)
            print(" " + w, end="", flush=True)
        if len(history) == MAX:
            break

    shuffle(history)
    print()
    print("->", history[-1])
    return history, history[-1]

def bamboo(start, domain):
    # &sp=b*d: starts with b, ends with d
    print("--------------------------------------")
    print("Plant " + start + " in " + domain + " as bamboo:")
    word = start
    history = [word]
    context = []
    print(word)
    for i in range(MAX):
        next = api.words(sp= word[len(word)-1] + "*", topics=domain, max=SPEED, md="f")
        if len(next) == 0:
            print("Nothing is grown")
            break
        next = next[0:5]
        shuffle(next)
        for item in next:
            w = item["word"]
            if w in history:
                continue
            history.append(w)
            word = w
            print(w)
            break
    return history, history[-1]

def koru(seed, domain=""):
    #ant
    print("--------------------------------------")
    print("Plant " + seed + " as koru:")
    word = seed
    history = [word]
    context = []
    print(word)
    for i in range(MAX):
        next = api.words(rel_ant=word, max=SPEED, md="f")

        if len(next) == 0:
            next = api.words(ml=word, max=SPEED, md="pf")
            shuffle(next)
            for item in next:
                w = item["word"]
                if getPosTag(word) == getPosTag(w):
                    if w in history:
                        continue
                    else:
                        next = api.words(rel_ant=w, max=SPEED, md="f")
                        if len(next) != 0:
                            history.append(w)
                            word = w
                            print("~", w)
                            break
            continue

        shuffle(next)

        for item in next:
            w = item["word"]
            if w in history or " " in w or "-" in w:
                continue
            history.append(w)
            word = w
            print("-",w)
            break

    return history, history[-1]

def pine(seed, domain):
    # sp=t?????k
    print("--------------------------------------")
    print("Plant " + seed + " in " + domain + " as pine:")
    word = seed
    history = []
    context = []
    s = word[0]
    e = word[len(word)-1]

    for i in range(MAX):
        next = api.words(sp= s + "?"*(i+1) + e, topics=domain, max=SPEED, md="f")
        if len(next) == 0:
            continue
        next = next[0:10]
        shuffle(next)
        for item in next:
            w = item["word"]
            if isBad(item, history,domain):
                continue
            history.append(w)
            word = w
            print(w)
            break
    return history, choice(history)
# def some root ....

def ginkgo(center,domain):
    # input has to be noun
    print("--------------------------------------")
    print("Plant " + center + " in " + domain + " as ginkgo:")
    word = center
    history = [word]
    context = []
    for i in range(MAX):
        next = api.words(rel_jjb=domain, topics=domain, max=SPEED, md="pf")
        shuffle(next)
        for item in next:
            if isBad(item, history,domain):
                continue
            w = item["word"]
            history.append(w)
            print(w + " " + word)
            break
    return history, choice(history)

PLANTS = {
"ginkgo":ginkgo,
"plant":plant,
"ivy":ivy,
"pine":pine,
"dandelion":dandelion,
"bamboo":bamboo,
"koru":koru
}

def random(start, domain):
    word = start
    last = ""
    for i in range(7):
        print("HERE:",word)
        tag = getPosTag(word)
        while(True):
            key, function = choice(list(PLANTS.items()))
            if key is not last:
                if (key is "ginkgo" and "NN" in tag) or (key in "plant koru" and tag in "NN NNS JJ") or key in "ivy bamboo pine dandelion":
                    break
        history, word = function(word, domain)
        last = key
    return

def datamuse(word, context, type):
    f = PLANTS[type]
    return f(word, context)

#plant: nn or jj
#ginkgo: nn
#koru: adj/nn
#random: bamboo, pine, ivy, dandelion
############

def test():
    random("anguish","paradise")

def demo():
    plant("soft","postmodernism")
    ginkgo("logic","sea")
    ivy("dream","proximity")
    dandelion("utopia","translation")
    pine("justice","alchemy")
    koru("binary")
    bamboo("bitterness","desert")

if __name__ == '__main__':

    if len(sys.argv) == 2:
        if sys.argv[1] == "test":
            test()
        elif sys.argv[1] == "demo":
            demo()

    elif (len(sys.argv) == 4 and sys.argv[2] == "in"):
        print("4", sys.argv)
        plant(sys.argv[1],sys.argv[3])
    elif (len(sys.argv) >= 4 and "as" in sys.argv and len(sys.argv) > sys.argv.index("as") + 1):
        idx = sys.argv.index("as")
        idx += 1
        if sys.argv[idx] == "ginkgo":
            sunflower(sys.argv[1],sys.argv[3])
        elif sys.argv[idx] == "ivy":
            ivy(sys.argv[1],sys.argv[3])
        elif sys.argv[idx] == "koru":
            koru(sys.argv[1])
        elif sys.argv[idx] == "bamboo":
            bamboo(sys.argv[1],sys.argv[3])
        elif sys.argv[idx] == "pine":
            pine(sys.argv[1],sys.argv[3])
        elif sys.argv[idx] == "dandelion":
            dandelion(sys.argv[1],sys.argv[3])
        elif sys.argv[idx] == "random":
            random(sys.argv[1],sys.argv[3])
        else:
            plant(sys.argv[1],sys.argv[3])

    else:
        print("Wrong command, please follow the format: ")
        print("plant --word(noun or adjective) in --domain as --name")
