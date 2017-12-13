import json
import random
from pymongo import MongoClient
from bson.objectid import ObjectId

client = MongoClient("mongodb://hshssingh4:password@ds133876.mlab.com:33876/foodgram_db")
db = client.foodgram_db


try:
    with open('temp.json', encoding = "utf8") as json_data:
    # Do things with fileh here
        data = json.load(json_data)
    #recipe table values

        for r in (data['hits']):
            #replace prints with update table command for recipes
            postedByArray = []
            postedByArray.append("5a2f91af35107b200bc056ff") # Harpreet
            postedByArray.append("5a2f91f835107b200bc05702") # Jeff
            postedByArray.append("5a2f920335107b200bc05703") # Vanessa
            postedByArray.append("5a2f91c135107b200bc05700") # Sam
            postedBy = postedByArray[random.randint(0,3)]

            title = r['recipe']['label']
            description = r['recipe']['source']
            image = r['recipe']['image']
            instructions = ""
            ingredients = []
            for ingredient in (r['recipe']['ingredientLines']):
                #replace prints with update table command for ingredients
                ingredients.append(ingredient)

            post = {
                    "title": title,
                    "description": description,
                    "postedBy": ObjectId(postedBy),
                    "imageUrl": image,
                    "instructions": instructions,
                    "ingredients": ingredients,
                    "__v": 0
                }

            postid = db.recipes.insert_one(post).inserted_id
            print(postid)

except Exception as e:
    print(e)

