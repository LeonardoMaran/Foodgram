import json
import random
import io
from pymongo import MongoClient
from bson.objectid import ObjectId

client = MongoClient("mongodb://sghuang2:password@ds015879.mlab.com:15879/foodgram")
db = client.foodgram


try:
    with io.open('recipe_data.json', encoding="utf8") as json_data:
    # Do things with fileh here
        data = json.load(json_data)
    #recipe table values

        for r in (data['hits']):
            #replace prints with update table command for recipes
            postedByArray = []
            postedByArray.append("5a98631c92f631dfbcc4f12c") # Sam
            postedByArray.append("5a98636c92f631dfbcc4f12d") # Jeff
            postedByArray.append("5a9863d292f631dfbcc4f12e") # Sean
            postedByArray.append("5a98642092f631dfbcc4f12f") # Kevin
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
