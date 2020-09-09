from djongo import models

# Create your models here.
class categories_average(models.Model):

    category_name = models.CharField(blank=True, null=True)
    score = models.FloatField(blank=True, null=True)

    class Meta:
        abstract = True

class Time(models.Model):

    year = models.IntegerField(blank=True, null=True)
    score = models.FloatField(blank=True, null=True)

    class Meta:
        abstract = True

class User(models.Model):

    name = models.CharField(max_length=60,blank=True)
    risk_score = models.FloatField(default=None,blank=True)
    category_avg = models.ArrayField(model_container=categories_average,null=True,blank=True)
    risk_run = models.ArrayField(model_container=Time,null=True,blank=True)
    objects = models.DjongoManager()

    def __str__(self):
        return self.name